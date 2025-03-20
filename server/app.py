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
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db.init_app(app)

# Initialize Flask-Migrate
cors = CORS(app)
migrate = Migrate(app, db)

# #Create & populate Database
# with app.app_context():
#     try:
#         engine = db.engine
#         inspector = inspect(engine)

#         if not (inspector.has_table("user_table")):
#             db.create_all()

#             # Create test listings
#             listing_one = ListingsModel(
#                 user_id=3,
#                 listing_name="Chopping Board",
#                 image="https://img.freepik.com/free-photo/wood-cutting-board_1203-3148.jpg?t=st=1738937016~exp=1738940616~hmac=ffa2367ba27fed36015963353d65c4a50973931a35202392a1943abdc630938b&w=996",
#                 price=3.00,
#                 condition="Like New",
#                 category="Other",
#                 description="Hand-made wooden chopping board"
#             )
#             db.session.add(listing_one)

#             listing_two = ListingsModel(
#                 user_id=1,
#                 listing_name="Sofa",
#                 image="https://img.freepik.com/free-photo/beautiful-interior-room-design-concept_23-2148786485.jpg?t=st=1738937245~exp=1738940845~hmac=d22d78f604dc8709293d294ab81ca42fe70a578bd3ad9c18f5a389bf064ccd31&w=996",
#                 price=20.50,
#                 condition="Used",
#                 category="Other",
#                 description="Grey sofa made from real wool"
#             )
#             db.session.add(listing_two)

#             # Create a test user with ID 1
#             user_one = UserModel(
#                 id=1,
#                 first_name="John",
#                 last_name="Doe",
#                 username="johndoe",
#                 phone_number="1234567890",
#                 email_address="johndoe@example.com"
#             )
#             db.session.add(user_one)

#             # Create a test user with ID 2
#             user_two = UserModel(
#                 id=2,
#                 first_name="James",
#                 last_name="May",
#                 username="jamesmay",
#                 phone_number="1234567890",
#                 email_address="jamesmay@example.com"
#             )
#             db.session.add(user_two)

#             db.session.commit()

#             # Create fake reviews

#             review_two = ReviewsModel(
#                 user_made_review=2,  # User 2 is reviewing User 1
#                 user_was_reviewed=1,  # User 1 was the buyer
#                 rating=4,
#                 description="Good buyer! Communication was quick and payment was fast.",
#                 seller=False  # User 1 was the buyer
#             )
#             db.session.add(review_two)

#             review_three = ReviewsModel(
#                 user_made_review=2,  # User 2 is reviewing User 1
#                 user_was_reviewed=1,  # User 1 was the seller
#                 rating=4,
#                 description="Good seller! Communication was quick and delivery was fast.",
#                 seller=True  # User 1 was the seller
#             )
#             db.session.add(review_three)

#             db.session.commit()

#             # Get the listing ID of "Baord"
#             board_listing = ListingsModel.query.filter_by(listing_name="Chopping Board").first()

#             # Create a chat between user 3 (seller) and user 1 (buyer)
#             chat = ChatsModel(
#                 listing_id=board_listing.id,
#                 active=True,
#                 user_to_sell=3,
#                 user_to_buy=1,
#                 seller_confirmed=False,
#                 buyer_confirmed=True,
#                 just_contacting = False
#             )
#             db.session.add(chat)

#             db.session.commit()

#             report1 = ReportsUserModel(
#             user_id=1,
#             user_id_who_reported=2,
#             reason="Inappropriate behavior",
#             solved=False
#         )
#         report2 = ReportsUserModel(
#             user_id=1,
#             user_id_who_reported=3,
#             reason="Scamming",
#             solved=False
#         )
#         report3 = ReportsUserModel(
#             user_id=3,
#             user_id_who_reported=2,
#             reason="Spamming",
#             solved=False
#         )

#         db.session.add_all([report1, report2, report3])
#         db.session.commit()

#         chopping_board = ListingsModel.query.filter_by(listing_name="Chopping Board").first()
#         sofa = ListingsModel.query.filter_by(listing_name="Sofa").first()

#         # Create reports for the listings
#         report1 = ReportsListingModel(
#             user_id_reported=3,
#             listing_id=chopping_board.id,
#             reason="Misleading description",
#             solved=False
#         )
#         report2 = ReportsListingModel(
#             user_id_reported=1,
#             listing_id=sofa.id,
#             reason="Suspicious price",
#             solved=False
#         )

#         db.session.add_all([report1, report2])
#         db.session.commit()

#         # Create review reports
#         review_report1 = ReportsReviewsModel(
#                 user_id_who_reported=2,
#                 review_id=review_two.id,
#                 reason="Inappropriate language",
#                 solved=False
#             )
#         review_report2 = ReportsReviewsModel(
#                 user_id_who_reported=1,
#                 review_id=review_three.id,
#                 reason="Fake review",
#                 solved=False
#             )
#         db.session.add_all([review_report1, review_report2])
#         db.session.commit()

#     except OperationalError as e:
#         print(f"Error checking or creating tables: {e}")


if __name__ == '__main__':
    app.run(debug=True)

routes = ['edit_contacts','delete_review','create_feedback','fetch_feedback','edit_feedback','delete_feedback','create_contact','fetch_contacts_moderator','fetch_contacts_user','delete_contact','create_user_reports','fetch_user_reports','edit_user_report','delete_user_report','create_listings_reports','fetch_listing_reports','edit_listings_report','delete_listing_report','create_reviews_reports','fetch_review_reports','edit_reviews_report','delete_review_report','get_payment_info','create_payment_info','get_chat_role','get_chat_users','create_chat','edit_chat','delete_chat','create_message','edit_message','get_messages','create_favourite','check_favourite','fetch_favourites','delete_favourites','get_user_chats', 'change_listing', 'change_profile', 'get_seller_info','create_listing','get_product','make_profile','get_user_info','delete_listing','get_user_listings','get_listings','start_login','create_review','get_reviews_seller','get_reviews_buyer','see_if_reviewed']

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
    redirect_url = f'http://studentnet.cs.manchester.ac.uk/authenticate/?url=https://8ab1-130-88-226-30.ngrok-free.app/profile&csticket={cs_ticket}&version=3&command=validate'

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
@app.route('/delete_review/<int:review_id>', methods=['DELETE'])
def delete_reviews(review_id):
    review = ReviewsModel.query.filter_by(id =review_id)

    if not review:
        return make_response({"message": "Review not found"}, 404)

    db.session.delete(review)
    db.session.commit()

    return make_response({"message": "Review deleted successfully"}, 200)

#Route for creating feedback request
@app.route('/create_feedback', methods=['POST'])
def create_feedback():
    feedback_data = request.get_json()
    username = feedback_data.get('username')
    category = feedback_data.get('category')
    feedback = feedback_data.get('feedback')
    name = feedback_data.get('name')
    email = feedback_data.get('email')

    # Check if required fields are provided
    if not category or not feedback:
        return make_response({"message": "Missing required fields"}, 400)

    # If the user is logged in (username is passed)
    if username:
        user = UserModel.query.filter_by(username=username).first()
        if not user:
            return make_response({"message": "User not found"}, 400)

        new_feedback = FeedbackModel(
            user_id_contacted=user.id,
            email=user.email_address,
            name=f"{user.first_name} {user.last_name}",
            category=category,
            feedback=feedback
        )
    else:
        # Non-logged-in users must provide name and email
        if not name or not email:
            return make_response({"message": "Name and email are required for non-logged-in users"}, 400)

        new_feedback = FeedbackModel(
            email=email,
            name=name,
            category=category,
            feedback=feedback
        )


    # Add feedback and commit to the database
    db.session.add(new_feedback)
    db.session.commit()

    return make_response({"message": "Feedback submitted successfully"}, 201)

#Route for getting all feedback
@app.route('/fetch_feedback', methods = ["GET"])
def fetch_feedback():

    feedback = FeedbackModel.query.filter_by(read = False).all()
    if not feedback:
        return make_response({"message": "No Data"}, 200)
    
    feedbackList = []

    for item in feedback:
        feedback_data ={
            "feedback_id": item.id,
            "category":item.category,
            "feedback": item.feedback,
            "is_read": item.read
        }

        if item.user_id_contacted:
            user = UserModel.query.filter_by(id=item.user_id_contacted).first()
            if not user:
                return make_response({"message": "User not found", "User": item.user_id_contacted}, 404)
            feedback_data.update({
                "user_id": user.id,
                "email": user.email_address,
                "name": user.first_name
            })
        else:
            feedback_data.update({
                "email": item.email,
                "name": item.name
            })

        feedbackList.append(feedback_data)

    return make_response({"Feedback": feedbackList}, 200)

#Route for updating feedback
@app.route('/edit_feedback/<int:feedback_id>', methods=['PATCH'])
def edit_feedback(feedback_id):
    data = request.get_json()

    feedback = FeedbackModel.query.filter_by(id = feedback_id).first()

    if not feedback:
        return make_response({"message": "feedback not found"}, 404)


    if data.get("read") == "True":
        feedback.read = True
    else:
        feedback.read = False

    db.session.commit()

    return make_response({"message": " updated successfully"}, 200)


#Route for deleting feedback
@app.route('/delete_feedback/<int:feedback_id>', methods=['DELETE'])
def delete_feedback(feedback_id):
    feedback = FeedbackModel.query.filter_by(id =feedback_id)

    if not feedback:
        return make_response({"message": "Feedback not found"}, 404)

    db.session.delete(feedback)
    db.session.commit()

    return make_response({"message": "Feedback deleted successfully"}, 200)


#Route for creating contact request
@app.route('/create_contact', methods=['POST'])
def create_contact():
    contact_data = request.get_json()
    username= contact_data.get('username') # Username from sessionStorage
    name = contact_data.get('name')  # From the form if not logged in
    email = contact_data.get('email')  # From the form if not logged in
    reason = contact_data.get('reason')
    timestamp = datetime.now()

    if not reason:
        return make_response({"message": "Reason is required"}, 400)

    user_id = None

    if username:
        # Fetch user details from the database
        user = UserModel.query.filter_by(username=username).first()
        if not user:
            return make_response({"message": "User not found"}, 400)

        user_id = user.id
        name = f"{user.first_name} {user.last_name}"
        email = user.email_address

    # Create new contact submission
    new_contact = ContactModel(
        user_id_contacted=user_id,
        name=name,
        email=email,
        reason=reason,
        timestamp=timestamp
    )

    db.session.add(new_contact)
    db.session.commit()

    return make_response({"message": "Contact submission created"}, 201)

#Route for getting all contact requests for moderator
@app.route('/fetch_contacts_moderator', methods = ["GET"])
def fetch_contacts_moderator():
    contacts = ContactModel.query.filter_by(responded = False).order_by(ContactModel.timestamp.asc()).all()

    if not contacts:
        return make_response({"message": "No Data"}, 200)

    contactList = []

    for contact in contacts:
        if contact.user_id_contacted:  # If user_id_contacted is not null
            user = UserModel.query.filter_by(id=contact.user_id_contacted).first()
            if not user:
                continue
            contact_data ={
                "contact_id": contact.id,
                "reason": contact.reason,
                "user_contacted": user.id,
                "email":user.email_address,
                "name": user.first_name + " " + user.last_name,
                "timestamp": contact.timestamp
            }
        else:  # Non-logged-in user case
            contact_data = {
                "contact_id": contact.id,
                "reason": contact.reason,
                "user_contacted": None,
                "name": contact.name,
                "email": contact.email,
                "timestamp": contact.timestamp,
            }

        contactList.append(contact_data)


    return make_response({"Contacts": contactList}, 200)

#Route for getting contacts for a specific user
@app.route('/fetch_contacts_user', methods = ["GET"])
def fetch_contacts_user():
    username = request.args.get('username', type=str)

    user= UserModel.query.filter_by(username =username).first()
    if not user:
            return make_response({"message": "user not found"}, 404)
    user_id = user.id

    contacts = ContactModel.query.filter_by(user_id_contacted = user_id).order_by(ContactModel.timestamp.asc()).all()
    if not contacts:
        return make_response({"message": "No Contact requests"}, 200)
    else:
        contactList = []

        for contact in contacts:
            contact_data ={
                "contact_id": contact.id,
                "reason": contact.reason,
                "moderator_response": contact.moderator_response
            }

            contactList.append(contact_data)


        return make_response({"Contacts": contactList}, 200)


#Route for updating contact
@app.route('/edit_contact/<int:contact_id>', methods=['PATCH'])
def edit_contacts(contact_id):
    data = request.get_json()

    contact = ContactModel.query.filter_by(id = contact_id).first()

    if not contact:
        return make_response({"message": "contact not found"}, 404)

    is_logged_in = data.get("is_logged_in")

    # Set the responded status to True
    contact.responded = True

    # Update moderator response only if the user was logged in
    if is_logged_in:
        contact.moderator_response = data.get("moderator_response", "")

    db.session.commit()

    return make_response({"message": " Contacts updated successfully"}, 200)

#Route for deleting contact
@app.route('/delete_contact/<int:contact_id>', methods=['DELETE'])
def delete_contact(contact_id):
    contact = ContactModel.query.filter_by(id = contact_id)

    if not contact:
        return make_response({"message": "Contact not found"}, 404)

    db.session.delete(contact)
    db.session.commit()

    return make_response({"message": "Contact deleted successfully"}, 200)


#Route for creating User Reports
@app.route('/create_user_report', methods=['POST'])
def create_user_report():

    data = request.get_json()
    user_who_reported_username = data.get('user_who_reported_username')
    reported_user_firstName = data.get('reported_user_firstname')
    details = data.get('details')

    if not user_who_reported_username or not reported_user_firstName:
        return make_response({"message":"missing required fields"}, 400)

    user = UserModel.query.filter_by(username=user_who_reported_username).first()
    if not user:
        return make_response({"message":"User Reported not found"}, 404)
    user_reported_id = user.id




    new_report = ReportsUserModel(user_id_who_reported = user_reported_id, reported_user_firstName = reported_user_firstName , details = details)
    db.session.add(new_report)
    db.session.commit()


    return make_response({"message":"Report Succesfully created"}, 201)

#Route for creating Listing Reports
@app.route('/create_listing_report', methods=['POST'])
def create_listing_report():
    data = request.get_json()
    user_who_reported_username = data.get('user_who_reported_username')
    listing_name = data.get('listing_name')
    sellers_firstname = data.get('sellers_firstname')
    details = data.get('details')

    if not user_who_reported_username or not listing_name or not sellers_firstname:
        return make_response({"message":"missing required fields"}, 400)

    user = UserModel.query.filter_by(username=user_who_reported_username).first()
    if not user:
        return make_response({"message":"User Reported not found"}, 404)
    user_reported_id = user.id




    new_report = ReportsListingModel(user_id_reported = user_reported_id, listing_name = listing_name , sellers_firstname = sellers_firstname, details=details)
    db.session.add(new_report)
    db.session.commit()


    return make_response({"message":"Report Succesfully created"}, 201)

#Route for creating Listing Reports
@app.route('/create_review_report', methods=['POST'])
def create_review_report():
    data = request.get_json()
    user_who_reported_username = data.get('user_who_reported_username')
    reviewer_firstname = data.get('reviewer_firstname')
    reviewed_firstname = data.get('reviewed_firstname')
    details = data.get('details')
    print(reviewer_firstname, reviewed_firstname, user_who_reported_username)

    if not user_who_reported_username or not reviewer_firstname or not reviewed_firstname:
        return make_response({"message":"missing required fields"}, 400)

    user = UserModel.query.filter_by(username=user_who_reported_username).first()
    if not user:
        return make_response({"message":"User Reported not found"}, 404)
    user_reported_id = user.id




    new_report = ReportsReviewsModel(user_id_who_reported = user_reported_id, reviwer_firstname = reviewer_firstname, reviewed_firstname = reviewed_firstname, details=details)
    db.session.add(new_report)
    db.session.commit()


    return make_response({"message":"Report Succesfully created"}, 201)

#Route for getting all User Reports
@app.route('/fetch_user_reports', methods = ["GET"])
def fetch_user_reports():

    reports = ReportsUserModel.query.filter_by(solved = False).all()
    if reports == []:
        return make_response({"message": "No Data"}, 200)
    else:
        reportList = []

        for report in reports:
            user = UserModel.query.filter_by(id = report.user_id).first()
            user2 = UserModel.query.filter_by(id = report.user_id_who_reported).first()
            if not user:
                return make_response({"message": "User not found", "User": report.user_id}, 404)
            report_data ={
                "report_id": report.id,
                "user_who_reported": report.user_id_who_reported,
                "user_who_reported_name": user2.first_name + " " + user2.last_name,
                "reason": report.reason,
                "user_id": report.user_id,
                "user_name": user.first_name + " " + user2.last_name,
                "email":user.email_address,
                "phone": user.phone_number

            }

            reportList.append(report_data)

        reportList = sorted(reportList, key=lambda x: x["user_name"])


        return make_response({"Users": reportList}, 200)

#Route for updating User Report
@app.route('/edit_user_report/<int:report_id>', methods=['PATCH'])
def edit_user_report(report_id):
    data = request.get_json()

    report = ReportsUserModel.query.filter_by(id = report_id).first()

    if not report:
        return make_response({"message": "report not found"}, 404)

    if data.get("solved") == "True":
        report.solved = True
    else:
        report.solved = False


    db.session.commit()

    return make_response({"message": " updated successfully"}, 200)

#Route for deleting User Reports
@app.route('/delete_user_report/<int:user_report_id>', methods=['DELETE'])
def delete_user_report(report_id):
    report = ReportsUserModel.query.filter_by(id = report_id)

    if not report:
        return make_response({"message": "Report not found"}, 404)

    db.session.delete(report)
    db.session.commit()

    return make_response({"message": "Report deleted successfully"}, 200)


#Route for creating Listing Reports
@app.route('/create_listings_reports', methods=['POST'])
def create_listings_reports():
    listing_data = request.get_json()
    user_reported = listing_data.get('user_reported')
    listing_id = listing_data.get('listing_id')
    reason = listing_data.get('reason')

    if not user_reported or listing_id is None:
        return make_response({"message":"missing required fields"}, 400)

    user = UserModel.query.filter_by(username=user_reported).first()
    if not user:
        return make_response({"message":"User not found"}, 400)
    user_id = user.id


    new_report = ReportsListingModel(user_id_who_reported = user_id, listing_id = listing_id, reason = reason)
    db.session.add(new_report)
    db.session.commit()


    return make_response({"message":"Report Succesfully created"}, 201)

#Route for getting all Listing Reports
@app.route('/fetch_listing_reports', methods = ["GET"])
def fetch_listing_reports():

    reports = ReportsListingModel.query.filter_by(solved = False).all()
    if reports == []:
        return make_response({"message": "No Data"}, 200)
    reportList = []

    for report in reports:
        listing = ListingsModel.query.filter_by(id = report.listing_id).first()
        if not listing:
            return make_response({"message": "Listing not found", "Listing": report.listing_id}, 404)

        reporter = UserModel.query.filter_by(id=report.user_id_reported).first()

        if not reporter:
            return make_response({"message": "User not found"}, 404)

        report_data ={
            "report_id": report.id,
            "user_who_reported_name": f"{reporter.first_name} {reporter.last_name}",
            "user_who_reported_id": report.user_id_reported,
            "reason": report.reason,
            "listing_id": listing.id,
            "listing_name":listing.listing_name,
            "listing_image": listing.image,
            "listing_description":listing.description,
            "listing_price": listing.price
        }

        reportList.append(report_data)

    reportList = sorted(reportList, key=lambda x: x["listing_id"])


    return make_response({"Listings": reportList}, 200)

#Route for updating Listings Report
@app.route('/edit_listings_report/<int:report_id>', methods=['PATCH'])
def edit_listings_report(report_id):
    data = request.get_json()

    report = ReportsListingsModel.query.filter_by(id = report_id).first()

    if not report:
        return make_response({"message": "report not found"}, 404)

    if data.get("solved") == "True":
        report.solved = True
    else:
        report.solved = False


    db.session.commit()

    return make_response({"message": " updated successfully"}, 200)

#Route for deleting Listing Reports
@app.route('/delete_listing_report/<int:report_id>', methods=['DELETE'])
def delete_listing_report(report_id):
    report = ReportsListingModel.query.filter_by(id = report_id).first()

    if not report:
        return make_response({"message": "Report not found"}, 404)

    db.session.delete(report)
    db.session.commit()

    return make_response({"message": "Report deleted successfully"}, 200)

#Route for creating Reviews Reports
@app.route('/create_reviews_reports', methods=['POST'])
def create_reviews_reports():
    review_data = request.get_json()
    user_reported = review_data.get('user_reported')
    review_id = review_data.get('review_id')
    reason = review_data.get('reason')

    if not user_reported or review_id is None:
        return make_response({"message":"missing required fields"}, 400)

    user = UserModel.query.filter_by(username=user_reported).first()
    if not user:
        return make_response({"message":"User not found"}, 400)
    user_id = user.id


    new_report = ReportsReviewsModel(user_id_who_reported = user_id, review_id = review_id, reason = reason)
    db.session.add(new_report)
    db.session.commit()


    return make_response({"message":"Report Succesfully created"}, 201)

#Route for getting all Reviews Reports
@app.route('/fetch_review_reports', methods = ["GET"])
def fetch_review_reports():
    reports = ReportsReviewsModel.query.filter_by(solved = False).all()

    if not reports:
        return make_response({"message": "No Data"}, 200)

    reportList = []

    for report in reports:
        review = ReviewsModel.query.filter_by(id = report.review_id).first()
        if not review:
            return make_response({"message": "Review not found", "Review": report.review_id}, 404)

        # Fetch user details
        reporter = UserModel.query.get(report.user_id_who_reported)
        reviewer = UserModel.query.get(review.user_made_review)
        reviewed = UserModel.query.get(review.user_was_reviewed)

        report_data ={
            "report_id": report.id,
            "user_who_reported_id": report.user_id_who_reported,
            "reporter_name": f"{reporter.first_name} {reporter.last_name}",
            "reason": report.reason,
            "review_id": review.id,
            "review_rating":review.rating,
            "review_description": review.description,
            "reviewer_name": f"{reviewer.first_name} {reviewer.last_name}",
            "reviewed_name": f"{reviewed.first_name} {reviewed.last_name}"
        }

        reportList.append(report_data)

    reportList = sorted(reportList, key=lambda x: x["review_id"])


    return make_response({"reviews": reportList}, 200)


#Route for updating Reviews Report
@app.route('/edit_reviews_report/<int:report_id>', methods=['PATCH'])
def edit_reviews_report(report_id):
    data = request.get_json()

    report = ReportsReviewsModel.query.filter_by(id = report_id).first()

    if not report:
        return make_response({"message": "report not found"}, 404)

    if data.get("solved") == "True":
        report.solved = True
    else:
        report.solved = False

    db.session.commit()

    return make_response({"message": " updated successfully"}, 200)

#Route for deleting Reviews Reports
@app.route('/delete_review_report/<int:review_report_id>', methods=['DELETE'])
def delete_review_report(review_report_id):
    report = ReportsReviewsModel.query.filter_by(id = report_id).first()

    if not report:
        return make_response({"message": "Report not found"}, 404)

    db.session.delete(report)
    db.session.commit()

    return make_response({"message": "Report deleted successfully"}, 200)