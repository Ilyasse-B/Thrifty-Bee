from flask import Flask, request, make_response, jsonify
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
from models.ReviewsModel import ReviewsModel
from models.FeedbackModel import FeedbackModel
from models.ContactModel import ContactModel
from models.ReportsReviewsModel import ReportsReviewsModel
from models.ReportsUserModel import ReportsUserModel
from models.ReportsListingModel import ReportsListingModel

import uuid

from datetime import datetime

# Initialize Flask app
app = Flask(__name__)

# Configure the SQLite database URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://thrifty_bee_postgres_db_user:h2dJXG0uQiZ4MxL67DukOTV6nuhm8xbl@dpg-cvalt3nnoe9s73fbjt50-a.frankfurt-postgres.render.com/thrifty_bee_postgres_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db.init_app(app)

# Initialize Flask-Migrate
cors = CORS(app)
migrate = Migrate(app, db)


if __name__ == '__main__':
    app.run(debug=True)

routes = ['get_payment_info','create_payment_info','get_chat_role','get_chat_users','create_chat','edit_chat','delete_chat','create_message','edit_message','get_messages','create_favourite','check_favourite','fetch_favourites','delete_favourites','get_user_chats', 'change_listing', 'change_profile', 'get_seller_info','create_listing','get_product','make_profile','get_user_info','delete_listing','get_user_listings','get_listings','start_login','create_review','get_reviews_seller','get_reviews_buyer','see_if_reviewed']

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
    redirect_url = f'http://studentnet.cs.manchester.ac.uk/authenticate/?url=https://3389-86-9-200-131.ngrok-free.app/profile&csticket={cs_ticket}&version=3&command=validate'

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
            "pending": listing.pending,
            "sold": listing.sold
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
            "description": listing.description,
            #"pending": listing.pending,
            "sold": listing.sold

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
        moderator_usernames = ["42c10e", "23c74d", "ae4859", "72c8a8", "7c4f2e"]
        if username in moderator_usernames:
            role = "Moderator"
        else:
            role = "User"
        user = make_profile(username,first_name,last_name,role)

    user_data = [
        {
            "user_id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "username": user.username,
            "email_address": user.email_address,
            "phone_number":user.phone_number,
            "user_role":user.user_role
        }
    ]

    return make_response({"user": user_data}, 200)

# This function below will run if the user does not yet exist in the database
def make_profile(username,f_name,l_name, roleIn):
    newUser = UserModel(first_name = f_name, last_name = l_name, username = username, phone_number = "", email_address = "", user_role = roleIn)
    db.session.add(newUser)
    db.session.commit()

    return UserModel.query.filter_by(username=username).first()

    #need to add something here to continue execution of program

# This route get's seller's contact info for the Product page
@app.route('/get_seller_info', methods=['GET'])
def get_seller_info():
    user_id = request.args.get('user_id', type=int)

    if not user_id:
        return make_response({"message": "user_id is required"}, 400)

    user = UserModel.query.filter_by(id=user_id).first()
    if not user:
        return make_response({"message": "User not found"}, 404)

    seller_data = {
        "username": user.username,
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

#This route creates a new chat from contact seller, but will first check if one exists
@app.route('/create_chat', methods=['POST'])
def create_chat():
    chat_data = request.get_json()
    listing_id = chat_data.get('listing_id')
    username = chat_data.get('username')
    set_pending = chat_data.get('set_pending', False)
    contacting = chat_data.get('just_contacting', False)

    if not listing_id or not username:
        return make_response({"message": "Missing required fields"}, 400)

    # Get user_to_buy ID from username
    user_buy = UserModel.query.filter_by(username=username).first()
    if not user_buy:
        return make_response({"message": "User not found"}, 404)
    user_buy_id = user_buy.id

    # Get user_to_sell ID from the listing
    listing = ListingsModel.query.filter_by(id=listing_id).first()
    if not listing:
        return make_response({"message": "Listing not found"}, 404)
    user_sell_id = listing.user_id

    if set_pending:
            listing.pending = True

    # Check if a chat already exists between these users for this listing
    existing_chat = ChatsModel.query.filter_by(
        listing_id=listing_id,
        user_to_sell=user_sell_id,
        user_to_buy=user_buy_id
    ).first()

    if existing_chat:
        existing_chat.just_contacting = contacting
        db.session.commit()
        return make_response({"chat_id": existing_chat.id}, 200)

    # Create a new chat if one doesn't exist
    new_chat = ChatsModel(
        listing_id=listing_id,
        active=True,
        user_to_sell=user_sell_id,
        user_to_buy=user_buy_id,
        seller_confirmed=False,
        buyer_confirmed=False,
        just_contacting = contacting
    )
    db.session.add(new_chat)

    db.session.commit()

    return make_response({"chat_id": new_chat.id}, 201)

#This route edits a chat
@app.route('/edit_chat', methods=['PATCH'])
def edit_chat():
    data = request.get_json()
    chat_id = data.get('chat_id')
    username = data.get('username')
    confirmation_type = data.get('confirmation_type')  # "item_received" or "payment_received"

    # Validate input
    if not chat_id or not username or not confirmation_type:
        return make_response(jsonify({"error": "Missing required fields"}), 400)

    # Fetch the chat
    chat = ChatsModel.query.filter_by(id=chat_id).first()
    if not chat:
        return make_response(jsonify({"error": "Chat not found"}), 404)

    # Fetch the user
    user = UserModel.query.filter_by(username=username).first()
    if not user:
        return make_response(jsonify({"error": "User not found"}), 404)

    # Determine if the user is the buyer or seller
    is_buyer = (chat.user_to_buy == user.id)
    is_seller = (chat.user_to_sell == user.id)

    if is_buyer and confirmation_type == "item_received":
        chat.buyer_confirmed = True
    elif is_seller and confirmation_type == "payment_received":
        chat.seller_confirmed = True
    else:
        return make_response(jsonify({"error": "Invalid confirmation type"}), 400)

    # Check if both parties have confirmed
    transaction_complete = chat.buyer_confirmed and chat.seller_confirmed

    if transaction_complete:
        chat.active = False  # Mark chat as inactive (completed)

        # Mark listing as sold
        listing = ListingsModel.query.filter_by(id=chat.listing_id).first()
        if listing:
            listing.sold = True

        # Insert system message confirming the transaction is complete
        system_message = MessagesModel(
            chat_id=chat.id,
            user_id=chat.user_to_sell,  # Belongs to the seller
            content="Item sale complete.",
            timestamp=datetime.utcnow(),
            read=False
        )
        db.session.add(system_message)

    db.session.commit()

    response_data = {
        "status": "success",
        "chat_id": chat.id,
        "transaction_complete": transaction_complete
    }

    return make_response(jsonify(response_data), 200)


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
    timestamp_str = message_data.get('timestamp')
    #read = message_data.get('read')

    # Convert timestamp string to a Python datetime object
    try:
        timestamp = datetime.fromisoformat(timestamp_str.replace("Z", "+00:00"))
    except ValueError:
        return make_response({"error": "Invalid timestamp format"}, 400)

    user = UserModel.query.filter_by(username=username).first()
    if not user:
        return make_response('User not found')
    user_id = user.id

    new_message = MessagesModel(chat_id = chat_id, user_id = user_id, content = content, timestamp = timestamp, read = False)
    db.session.add(new_message)
    db.session.commit()

    return make_response({"success": "Message sent"}, 201)



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
    chat_id = request.args.get('chat_id', type = int)

    if not chat_id:
        return make_response({"message": "chat id is required"}, 400)

    messages = MessagesModel.query.filter_by(chat_id=chat_id).order_by(MessagesModel.timestamp.asc()).all()


    chat_data = [
        {
            "id" : message.id,
            "user_id" : message.user_id,
            "content" : message.content,
            "timestamp" : message.timestamp,
            "read" : message.read
        }
        for message in messages
    ]

    return make_response({"messages": chat_data}, 200)

# This route get's the user id's of the user's in a chat
@app.route('/get_chat_users', methods=['GET'])
def get_chat_users():
    username = request.args.get('username')
    other_person_name = request.args.get('other_person_name')

    if not username or not other_person_name:
        return make_response({"error": "Both username and other_person_name are required"}, 400)

    user = UserModel.query.filter_by(username=username).first()
    other_person = UserModel.query.filter_by(first_name=other_person_name).first()

    if not user or not other_person:
        return make_response({"error": "User not found"}, 404)

    return make_response({
        "user_id": user.id,
        "other_person_id": other_person.id
    }, 200)


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
            "listing_id": chat.listing_id,
            "other_person": UserModel.query.get(chat.user_to_sell).first_name
            if chat.user_to_buy == user_id
            else UserModel.query.get(chat.user_to_buy).first_name,
            "listing_name": ListingsModel.query.get(chat.listing_id).listing_name,
            "listing_image": ListingsModel.query.get(chat.listing_id).image,
            "active": chat.active,
            "just_contacting": chat.just_contacting
        }
        for chat in chats
        if UserModel.query.get(chat.user_to_sell) and UserModel.query.get(chat.user_to_buy) and ListingsModel.query.get(chat.listing_id)
    ]

    return make_response({"chats": chat_data}, 200)

#This route checks if the user is the buyer in Chat.js
@app.route('/get_chat_role', methods=['GET'])
def get_chat_role():
    chat_id = request.args.get('chat_id')
    username = request.args.get('username')

    if not chat_id or not username:
        return jsonify({"status": "error", "message": "Missing chat_id or username"}), 400

    # Get the user by username
    user = UserModel.query.filter_by(username=username).first()
    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404

    # Get the chat
    chat = ChatsModel.query.filter_by(id=chat_id).first()
    if not chat:
        return jsonify({"status": "error", "message": "Chat not found"}), 404

    # Determine if the user is the buyer
    is_buyer = user.id == chat.user_to_buy

    return jsonify({"status": "success", "is_buyer": is_buyer,  "buyer_confirmed": chat.buyer_confirmed,
        "seller_confirmed": chat.seller_confirmed}), 200

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

    existing_favourite = FavouritesModel.query.filter_by(user_id=user_id, listings_id=listing_id).first()

    if existing_favourite:
        return make_response({"message": "favourite already exists"}, 400)


    new_favourite = FavouritesModel(user_id = user_id, listings_id = listing_id)


    db.session.add(new_favourite)
    db.session.commit()

    return make_response({"message": "Favourite Model created successfully"}, 201)




#This route checks if already a favourite
@app.route('/check_favorite', methods = ["GET"])
def check_favourite():
    username = request.args.get('username', type=str)
    listings_id = request.args.get('listings_id', type=int)

    if not username:
        return make_response({"message": "username is required"}, 400)

    user = UserModel.query.filter_by(username=username).first()
    listing = ListingsModel.query.filter_by(id=listings_id).first()

    if not listing:
        return make_response('User not found', 404)
    if not user:
        return make_response('User not found', 404)

    user_id = user.id
    print(user.id)
    print(listing.id)

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
    listings = []

    for favourite in favourites:
        listings_id = favourite.listings_id
        listing = ListingsModel.query.filter_by(id=listings_id).first()
        listings.append(listing)


    listings_data = [
    {
        "id": listing.id,
        "title": listing.listing_name,
        "image": listing.image,
        "price": listing.price,
        "condition": listing.condition,
        "category": listing.category,
        "description": listing.description


    }
    for listing in listings
  ]





    return make_response({"favourites": listings_data}, 200)



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

#This route creates a payment once paid
@app.route('/create_payment_info', methods =['POST','PATCH'] )
def create_payment_info():
    payment_data = request.get_json()
    listing_id = payment_data.get("listing_id")
    username_bought = payment_data.get("username_bought")
    payment_type = payment_data.get("payment_type")

    if not listing_id or not username_bought:  # Validate required fields
        return make_response({"message": "Missing required fields"}, 400)

    user = UserModel.query.filter_by(username=username_bought).first()
    if not user:
        return make_response('User not found')
    user_id = user.id

    listing = ListingsModel.query.filter_by(id=listing_id).first()

    if not listing:
        return make_response({"message": "Listing not found"}, 404)

    listing.pending = True

    db.session.commit()

    new_payment = TransactionsModel(listing_id= listing_id ,user_id_bought = user_id, payment_type = payment_type)

    db.session.add(new_payment)
    db.session.commit()

    return make_response({"message": "Payment info created successfully"}, 201)

#This route get payment info and what the listing was
@app.route('/get_payment_info', methods =['GET'] )
def get_payment_info():
    listing_id= request.args.get('listing_id', type = int)

    if not listing_id:
        return make_response({"message": "listing_id is required"}, 400)

    transaction = TransactionsModel.query.filter_by(listing_id=listing_id).first()
    listing = ListingsModel.query.filter_by(listing_id=listing_id).first()

    payment_data = [
    {
        "listing_id": listing_id,
        "title": listing.listing_name,
        "image": listing.image,
        "price": listing.price,
        "payment_type": transaction.payment_type
    }
    ]
    return make_response({"payment info": payment_data}, 200)

#This route creates a review for a user
@app.route('/create_review', methods=['POST'])
def create_review():
    review_data = request.get_json()
    user_made_review_username = review_data.get('user_made_review_username')
    rating = review_data.get('rating')
    description = review_data.get('description')
    user_was_reviewed_id = review_data.get('user_was_reviewed_id')
    is_seller = review_data.get('is_seller')
    print(user_made_review_username)
    print(rating)
    print(description)
    print(user_was_reviewed_id)
    print(is_seller)

    if not rating or is_seller is None:
        return make_response({"message":"missing required fields"}, 400)

    user_made = UserModel.query.filter_by(username=user_made_review_username).first()
    print('user made', user_made)
    if not user_made:
        return make_response({"message":"User_made not found"}, 400)
    user_made_id = user_made.id

    user_was = UserModel.query.filter_by(id=user_was_reviewed_id).first()
    print('user was', user_was)
    if not user_was:
        return make_response({"message":"user_was not found"}, 400)

    existing_review = ReviewsModel.query.filter_by(user_made_review=user_made_id, user_was_reviewed=user_was_reviewed_id).first()
    if existing_review:
        return make_response({"message":"review already exists"}, 400)



    new_review = ReviewsModel(user_made_review = user_made_id, rating = rating, description = description, user_was_reviewed = user_was_reviewed_id, seller = is_seller)
    db.session.add(new_review)
    db.session.commit()


    return make_response({"message":"Review Succesfully created"}, 201)


# This route get reviews for a seller
@app.route('/get_reviews_seller', methods = ["GET"])
def get_reviews_seller():
    listings_id = request.args.get('listing_id', type=int)

    listing = ListingsModel.query.filter_by(id = listings_id).first()
    if not listing:
        return make_response({"message": "Listing not found"}, 404)

    seller_id = listing.user_id

    reviews = ReviewsModel.query.filter_by(user_was_reviewed = seller_id, seller = True).all()

    if reviews == []:
        return make_response ("No reviews as seller",200)

    user_seller = UserModel.query.filter_by(id=seller_id).first()
    if not user_seller:
            return make_response({"message": "Seller not found"}, 404)
    reviewList= []
    seller_name = user_seller.first_name

    for review in reviews:
        user_bought = UserModel.query.filter_by(id=review.user_made_review).first()
        if not user_bought:
            return make_response({"message": "User not found", "user_name": seller_name}, 404)
        review_data = {
            "buyer_name": user_bought.first_name,
            "seller_name": seller_name,
            "rating": review.rating,
            "description": review.description or ""
        }

        reviewList.append(review_data)

    return make_response({"user_name": seller_name, "reviews": reviewList}, 200)

# This route gets reviews for a buyer
@app.route('/get_reviews_buyer', methods = ["GET"])
def get_reviews_buyer():
    user_id = request.args.get('user_id', type=int)

    user_bought= UserModel.query.filter_by(id=user_id).first()
    if not user_bought:
            return make_response({"message": "buyer not found"}, 404)
    reviewList= []

    buyer_name = user_bought.first_name

    reviews = ReviewsModel.query.filter_by(user_was_reviewed = user_id, seller = False).all()

    if reviews == []:
        return make_response ("No reviews as buyer",200)

    reviewList= []

    for review in reviews:
        user_seller = UserModel.query.filter_by(id=review.user_made_review).first()
        if not user_seller:
            return make_response({"message": "User not found", "user_name":buyer_name}, 404)
        review_data = {
            "buyer_name": buyer_name,
            "seller_name": user_seller.first_name,
            "rating": review.rating,
            "description": review.description or ""
        }
        reviewList.append(review_data)
    print(reviewList)

    return make_response({"user_name":buyer_name, "reviews": reviewList}, 200)

@app.route('/see_if_reviewed', methods = ["GET"])
def see_if_reviewed():
    user_who_reviewed_id = request.args.get('user_who_reviewed_id', type=int)
    user_review_about_id = request.args.get('user_review_about_id', type=int)

    if not user_who_reviewed_id or not user_review_about_id:
        return make_response({"message": "Missing user IDs"}, 400)

    review = ReviewsModel.query.filter_by(user_made_review=user_who_reviewed_id, user_was_reviewed=user_review_about_id).first()

    if review:
        return make_response({"message": "Already Reviewed"}, 200)
    else:
        return make_response({"message": "Not Reviewed"}, 200)

# Route for deleting reviews from the dashboard page
@app.route('/delete_listing/<int:review_id>', methods=['DELETE'])
def delete_reviews(review_id):
    review = ReviewsModel.query.get(review_id)

    if not review:
        return make_response({"message": "Review not found"}, 404)

    db.session.delete(review)
    db.session.commit()

    return make_response({"message": "Review deleted successfully"}, 200)
