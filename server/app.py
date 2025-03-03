from flask import Flask, request, make_response
from flask_migrate import Migrate
import requests
from models.index import db
from flask_cors import CORS
from sqlalchemy import inspect
from sqlalchemy.exc import OperationalError

from models.ChatsModel import ChatsModel
from models.RolesModel import RolesModel
from models.TransactionsModel import TransactionsModel
from models.UserModel import UserModel
from models.UserRolesModel import UserRolesModel
from models.ListingsModel import ListingsModel
from models.MessagesModel import MessagesModel
from models.FavouritesModel import FavouritesModel
import uuid


# Initialize Flask app
app = Flask(__name__)

# Configure the SQLite database URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db.init_app(app)

# Initialize Flask-Migrate
cors = CORS(app)
migrate = Migrate(app, db)

#Create & populate Database
with app.app_context():
    try:
        engine = db.engine
        inspector = inspect(engine)

        if not (inspector.has_table("user_table")):
            db.create_all()

            # Create test listings
            listing_one = ListingsModel(
                user_id=3,
                listing_name="Chopping Board",
                image="https://img.freepik.com/free-photo/wood-cutting-board_1203-3148.jpg?t=st=1738937016~exp=1738940616~hmac=ffa2367ba27fed36015963353d65c4a50973931a35202392a1943abdc630938b&w=996",
                price=3.00,
                condition="Like New",
                category="Other",
                description="Hand-made wooden chopping board"
            )
            db.session.add(listing_one)

            listing_two = ListingsModel(
                user_id=3,
                listing_name="Sofa",
                image="https://img.freepik.com/free-photo/beautiful-interior-room-design-concept_23-2148786485.jpg?t=st=1738937245~exp=1738940845~hmac=d22d78f604dc8709293d294ab81ca42fe70a578bd3ad9c18f5a389bf064ccd31&w=996",
                price=20.50,
                condition="Used",
                category="Other",
                description="Grey sofa made from real wool"
            )
            db.session.add(listing_two)

            # Create a test user with ID 2
            user_two = UserModel(
                id=2,
                first_name="John",
                last_name="Doe",
                username="johndoe",
                phone_number="1234567890",
                email_address="johndoe@example.com"
            )
            db.session.add(user_two)

            db.session.commit()

            # Get the listing ID of "Sofa"
            sofa_listing = ListingsModel.query.filter_by(listing_name="Sofa").first()

            # Create a chat between user 1 (seller) and user 2 (buyer)
            chat = ChatsModel(
                listing_id=sofa_listing.id,
                active=True,
                user_to_sell=3,
                user_to_buy=2,
                seller_confirmed=False,
                buyer_confirmed=False
            )
            db.session.add(chat)

            db.session.commit()

    except OperationalError as e:
        print(f"Error checking or creating tables: {e}")


if __name__ == '__main__':
    app.run(debug=True)

routes = ['create_chat','edit_chat','delete_chat','create_message','edit_message','get_messages','create_favourite','check_favourite','fetch_favourites','delete_favourites','get_user_chats', 'change_listing', 'change_profile', 'get_seller_info','create_listing','get_product','make_profile','get_user_info','delete_listing','get_user_listings','get_listings','start_login']

@app.before_request
def check_login():
    if request.endpoint not in routes:

            try:

                app_url = 'therxa' # the app_url does not matter for student validation
                cs_ticket= request.args.get('cs_ticket')
                username = request.args.get('username')
                full_name = request.args.get('full_name')
                first_name = full_name.split(' ')[0]
                last_name = full_name.split(' ')[1]
                print(cs_ticket)
                print(username)
                print(full_name)
                auth_url = f'https://studentnet.cs.manchester.ac.uk/authenticate/?url={app_url}&csticket={cs_ticket}&version=3&command=confirm&username={username}&fullname={first_name}+{last_name}'
                response = requests.get(auth_url)
                if response.text != 'true':
                    return make_response('invalid credntials', 401)
            except:
                 return make_response('Invalid user Credentials',401)

@app.route('/intiate_login', methods=['GET'])
def start_login():
    cs_ticket = uuid.uuid4().hex[:12]                                         # ngrok Link here 
    redirect_url = f'http://studentnet.cs.manchester.ac.uk/authenticate/?url=https://8588-86-9-200-131.ngrok-free.app/profile&csticket={cs_ticket}&version=3&command=validate'

    res = {
        "auth_url": redirect_url,

    }
    return make_response(res)

@app.route('/protected', methods=['GET'])
def check_login():
    return make_response('I return',200)

# Route for fetching all listings in the database for the search page
@app.route('/listings', methods=['GET'])
def get_listings():
    listings = ListingsModel.query.all()
    listings_data = [
        {
            "id": listing.id,
            "listing_name": listing.listing_name,
            "image": listing.image,
            "price": listing.price,
            "condition": listing.condition,
            "category": listing.category,
            "description": listing.description,
            "user_id": listing.user_id,
            #"pending": listing.pending,
            #"sold": listing.sold
        }
        for listing in listings
    ]
    return make_response({"listings": listings_data}, 200)

# Route for fetching logged in user's listings that they created for the Dashboard page
@app.route('/user_listings', methods=['GET'])
def get_user_listings():
    username = request.args.get('username', type=str)  # Get user_id from query parameters

    if not username:
        return make_response({"message": "username is required"}, 400)
    user = UserModel.query.filter_by(username=username).first()
    user_id = user.id

    listings = ListingsModel.query.filter_by(user_id=user_id).all()

    listings_data = [
        {
            "id": listing.id,
            "title": listing.listing_name,
            "image": listing.image,
            "price": listing.price,
            "condition": listing.condition,
            "category": listing.category,
            "description": listing.description
            #"pending": listing.pending,
            #"sold": listing.sold
            
        }
        for listing in listings
    ]

    return make_response({"listings": listings_data}, 200)

# Route for deleting listings from the dashboard page
@app.route('/delete_listing/<int:listing_id>', methods=['DELETE'])
def delete_listing(listing_id):
    listing = ListingsModel.query.get(listing_id)

    if not listing:
        return make_response({"message": "Listing not found"}, 404)

    db.session.delete(listing)
    db.session.commit()

    return make_response({"message": "Listing deleted successfully"}, 200)

# Route for getting user details for the Dashboard page
@app.route('/get_profile', methods=['GET', 'POST'])
def get_user_info():
    username = request.args.get('username', type=str)  #getting email address

    if not username:
        return make_response({"message": "username is required"}, 400)

    user = UserModel.query.filter_by(username=username).first()
    if not user:
        first_name = request.args.get('first_name', type = str)
        last_name = request.args.get('last_name', type =str)
        user = make_profile(username,first_name,last_name)

    user_data = [
        {
            "user_id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "username": user.username,
            "email_address": user.email_address,
            "phone_number":user.phone_number
        }
    ]

    return make_response({"user": user_data}, 200)

# This function below will run if the user does not yet exist in the database
def make_profile(username,f_name,l_name):
    newUser = UserModel(first_name = f_name, last_name = l_name, username = username, phone_number = "", email_address = "")
    db.session.add(newUser)
    db.session.commit()

    return UserModel.query.filter_by(username=username).first()

    #need to add something here to continue execution of program

# This route get's seller's contact info for the Product page
@app.route('/get_seller_info', methods=['GET'])
def get_seller_info():
    username = request.args.get('username', type=str)

    if not username:
        return make_response({"message": "username is required"}, 400)

    user = UserModel.query.filter_by(username=username).first()
    if not user:
        return make_response({"message": "User not found"}, 404)

    seller_data = {
        "first_name": user.first_name,
        "email": user.email_address,
        "phone_number": user.phone_number
    }

    return make_response({"seller": seller_data}, 200)

# This route is used to edit a user's contact details from the Profile page
@app.route('/edit_profile/<username>', methods=['PATCH'])
def change_profile(username):
    data = request.get_json()
    user = UserModel.query.filter_by(username=username).first()

    if not user:
        return make_response({"message": "User not found"}, 404)

    user.email_address = data.get("email", user.email_address)
    user.phone_number = data.get("phone_number", user.phone_number)

    db.session.commit()

    return make_response({"message": "Profile updated successfully"}, 200)

# @app.route('/delete_user/<int:user_id>', methods=['DELETE'])
# def delete_user(user_id):
#     user= user.query.filter_by(email_address=email_a)

#     if not user:
#         return make_response({"message": "User not found"}, 404)

#     db.session.delete(user)
#     db.session.commit()

#     return redirect(url_for('Ended'))

# @app.route('/Ended')
#     return "Successfully deleted account"

# This route fetches details of a single item for the Product page
@app.route('/product_listing',methods=['GET'])
def get_product():
    product = request.args.get('listing_id', type = int)

    listings = ListingsModel.query.filter_by(listing_id=product).first()

    listings_data = [
        {
            "id": listing.id,
            "listing_name": listing.listing_name,
            "image": listing.image,
            "price": listing.price,
            "condition": listing.condition,
            "category": listing.category,
            "description": listing.description
            #"pending": listing.pending,
            #"sold": listing.sold
        }
        for listing in listings
    ]
    return make_response({"listings": listings_data}, 200)

# This route creates a new listing in the database for the Dashboard page
@app.route('/create_listing', methods=['POST'])
def create_listing():



    listing_data = request.get_json()
    username = listing_data.get('username')
    name = listing_data.get('listing_name')
    image = listing_data.get('image')
    price = listing_data.get('price')
    condition= listing_data.get('condition')
    category= listing_data.get('category')
    description= listing_data.get('description')
    #pending = False
    #sold = False

    if not name or not price or not image:  # Validate required fields
        return make_response({"message": "Missing required fields"}, 400)

    user = UserModel.query.filter_by(username=username).first()
    if not user:
        return make_response('User not found')
    user_id = user.id

    new_listing = ListingsModel(user_id = user_id, listing_name = name, image = image  ,price = price, condition = condition, category = category, description = description)
    db.session.add(new_listing)
    db.session.commit()

    return make_response({"message": "Item uploaded successfully"}, 201)

# This route is used to edit a listing from the Dashboard page
@app.route('/edit_listing/<int:id>', methods=['PATCH'])
def change_listing(id):
    listing = ListingsModel.query.filter_by(id = id).first()
    if not listing:
        return make_response('Listing not found', 404)
    else:
        data = request.json
        new_listing_name = data.get('listing_name')
        new_listing_image = data.get('listing_image')
        new_listing_price = data.get('listing_price')

        if not new_listing_name or not new_listing_image or not new_listing_price:
            return make_response('listing_name, listing_image, listing_price are required', 400)

        listing.listing_name = new_listing_name
        listing.image = new_listing_image
        listing.price = new_listing_price

        db.session.commit()

        response_dict = {
        "status": 'Successful',
        "listing": {
            "id": listing.id,
            "listing_name": listing.listing_name,
            "image": listing.image,
            "price": listing.price,
            }
        }

        return make_response(response_dict, 200)

#This route creates a new chat from contact seller
@app.route('/create_chat', methods=['POST'])
def create_chat():
    chat_data = request.get_json()
    listing_id = chat_data.get('listing_id')
    active = True
    user_to_sell = chat_data.get('user_sell_id')
    user_to_buy = chat_data.get('user_buy_id')
    seller_confirmed = False
    buyer_confirmed = False

    if not listing_id or not user_to_buy:  # Validate required fields
        return make_response({"message": "Missing required fields"}, 400)

    user_buy = UserModel.query.filter_by(username=user_to_buy).first()
    if not user_buy:
        return make_response('User not found')
    user_buy_id = user_buy.id

    user_sell = UserModel.query.filter_by(username=user_to_sell).first()
    if not user_sell:
        return make_response('User not found')
    user_sell_id = user_sell.id



    new_chat = ChatsModel(listing_id = listing_id, active = active , user_to_sell = user_to_sell ,user_to_buy = user_buy_id, seller_confirmed= seller_confirmed, buyer_confirmed = buyer_confirmed)
    db.session.add(new_chat)
    db.session.commit()

    return make_response({"message": "Chat created successfully"}, 201)

#This route edits a chat
@app.route('/edit_chat/<int:id>',methods = ['PATCH'])
def edit_chat(id):
    chat = ChatsModel.query.filter_by(id = id).first()
    if not chat:
        return make_response('Chat not found', 404)
    else:
        data = request.json()
        n_active = data.get('active')
        n_seller_confirmed =data.get('seller_confirmed')
        n_buyer_confirmed = data.get('buyer_confirmed')

    if not n_active or n_seller_confirmed or n_buyer_confirmed :
        return make_response('need extra information ', 400)

    chat.active = n_active
    chat.seller_confirmed = n_seller_confirmed
    chat.buyer_confirmed = n_buyer_confirmed

    db.session.commit()

    response_dict = {
    "status": 'Successful',
    "Chat": {
        "id": chat.id,
        "listing_id": chat.listing_id,
        "user_sell_id": chat.user_sell_id,
        "user_buy_id" : chat.user_buy_id,
        "active" : chat.active,
        "seller_confirmed" : chat.seller_confirmed,
        "buyer_confirmed" : chat.buyer_confirmed

        }
    }

    return make_response(response_dict, 200)


#This route deletes a chat when sale falls through / sale goes through
@app.route('/delete_chat/<int:id>',methods = ['DELETE'])
def delete_chat(id):
    chat = ChatsModel.query.filter_by(id = id).first()

    if not chat:
        return make_response({"message": "chat not found"}, 404)

    db.session.delete(chat)
    db.session.commit()

    return make_response({"message": "chat deleted successfully"}, 200)


#This route creates a message
@app.route('/create_message',methods = ['POST'])
def create_message():
    message_data = request.get_json()
    chat_id = message_data.get('chat_id')
    username = message_data.get('username')
    content = message_data.get('content')
    timestamp = message_data.get('timestamp')
    #read = message_data.get('read')

    user = UserModel.query.filter_by(username=username).first()
    if not user:
        return make_response('User not found')
    user_id = user.id

    new_message = MessagesModel(chat_id = chat_id, user_id = user_id, content = content, timestamp = timestamp)
    db.session.add(new_message)
    db.session.commit()

    

#This route edits message
@app.route('/get_message_chat/<int:id>',methods=["PATCH"])
def edit_message(id):
    message = MessagesModel.query.filter_by(id = id).first()
    if not message:
        return make_response('Message not found', 404)
    else:
        data = request.json()
        new_content = data.get('content')

        if not new_content:
            return make_response('new_content', 400)

        message.content = new_content
        

        db.session.commit()

        response_dict = {
        "status": 'Successful',
        "Message": {
            "id": message.id,
            "user_id" : message.user_id,
            "content" : message.content,
            "timestamp" : message.timestamp,
            "read" : message.read

            }
        }

        return make_response(response_dict, 200)


#This route fetches all message for a chat
@app.route('/get_message_chat',methods=["GET"])
def get_messages():
    chat = request.args.get('chat_id', type = int)

    if not chat:
        return make_response({"message": "chat id is required"}, 400)
    
    messages = MessagesModel.query.filter_by(chat_id=chat).order_by(MessagesModel.timestamp.asc()).all()
    

    chat_data = [
        {
            "id" : messages.id,
            "user_id" : messages.user_id,
            "content" : messages.content,
            "timestamp" : messages.timestamp,
            "read" : messages.read
        }
        for chat in chat
    ]

    return make_response({"messages in chat": chat_data}, 200)
 
 # This route fetches all the chats for a specific user
@app.route('/user_chats', methods=['GET'])
def get_user_chats():
    username = request.args.get('username')

    if not username:
        return make_response({"error": "Username is required"}, 400)

    # Find the user's ID
    user = UserModel.query.filter_by(username=username).first()
    if not user:
        return make_response({"error": "User not found"}, 404)

    user_id = user.id

    # Fetch all chats where the user is either the buyer or the seller
    chats = ChatsModel.query.filter(
        (ChatsModel.user_to_buy == user_id) | (ChatsModel.user_to_sell == user_id)
    ).all()

    chat_data = [
        {
            "chat_id": chat.id,
            "other_person": UserModel.query.get(chat.user_to_sell).first_name
            if chat.user_to_buy == user_id
            else UserModel.query.get(chat.user_to_buy).first_name,
            "listing_name": ListingsModel.query.get(chat.listing_id).listing_name,
            "listing_image": ListingsModel.query.get(chat.listing_id).image
        }
        for chat in chats
        if UserModel.query.get(chat.user_to_sell) and UserModel.query.get(chat.user_to_buy) and ListingsModel.query.get(chat.listing_id)
    ]

    return make_response({"chats": chat_data}, 200)


#This route create a favourite for a specific listing
@app.route('/create_favourite', methods =['POST'] )
def create_favourite():
    favourite_data = request.get_json()
    username = favourite_data.get("username")
    listing_id = favourite_data.get("listing_id")

    if not listing_id or not username:  # Validate required fields
        return make_response({"message": "Missing required fields"}, 400)

    user = UserModel.query.filter_by(username=username).first()
    if not user:
        return make_response('User not found')
    user_id = user.id

    new_favourite = FavouritesModel(user_id = user_id, listing_id = listing_id)
    db.session.add(new_favourite)
    db.session.commit()

    return make_response({"message": "Favourite Model created successfully"}, 201)




#This route checks if already a favourite
@app.route('/check_favorite/', methods = ["GET"])
def check_favourite():
    username = request.args.get('username', type=str) 
    listings_id = request.args.get('listings_id', type=int) 

    if not username:
        return make_response({"message": "username is required"}, 400)
    
    user = UserModel.query.filter_by(username=username).first()
    if not user:
        return make_response('User not found')
    user_id = user.id

    favourite = FavouritesModel.query.filter_by(user_id=user_id, listings_id = listings_id).first()

    if favourite:
        return make_response({"message": "Is a favourite"}, 200) 
    else:
        return make_response({"message": "Not a favourite"}, 200) 




#This route fetches favourtie for profile page
@app.route('/fetch_favourites', methods = ["GET"])
def fetch_favourites():
    username = request.args.get('username', type=str) 

    if not username:
        return make_response({"message": "username is required"}, 400)
    
    user = UserModel.query.filter_by(username=username).first()
    if not user:
        return make_response({"message": "User not found"}, 404)

    user_id = user.id

    favourites = FavouritesModel.query.filter_by(user_id=user_id).all()

    favourites_data = [
        {
            "listing.id": favourites.listings_id
            
        }
        for favourite in favourites
    ]

    return make_response({"favourites": favourites_data}, 200)



#This route deletes favourite for profile page
@app.route('/delete_favourites/<username>/<int:listing_id>',methods = ['DELETE'])
def delete_favourites(username, listing_id):
    user = UserModel.query.filter_by(username=username).first()

    if not user:
        return make_response({"message":"User not found"})
    user_id = user.id

    favourite = FavouritesModel.query.filter_by(user_id=user_id,listings_id = listing_id).first()

    if not favourite:
        return make_response({"message": "Favourite not found"}, 404)

    db.session.delete(favourite)
    db.session.commit()

    return make_response({"message": "Favourites deleted successfully"}, 200)



