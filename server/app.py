from flask import Flask, request, make_response
import requests
from models.index import db
from flask_cors import CORS
from sqlalchemy import and_, create_engine, inspect
from sqlalchemy.exc import OperationalError

from flask_migrate import Migrate
#from models.DummyModel import DummyModel
from models.ChatsModel import ChatsModel
from models.RolesModel import RolesModel
from models.TransactionsModel import TransactionsModel
from models.UserModel import UserModel
from models.UserRolesModel import UserRolesModel
from models.ListingsModel import ListingsModel
from models.MessagesModel import MessagesModel
import uuid

import uuid

import uuid


# Initialize Flask app
app = Flask(__name__)

# Configure the SQLite database URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db.init_app(app)
# Initialize Flask-Migrate

CORS(app)
migrate = Migrate(app, db)

#Create Database
with app.app_context():
    try:
        engine = db.engine
        inspector = inspect(engine)

        if not (inspector.has_table("user_table")):
            db.create_all()
            listing_one = ListingsModel ( user_id = 1, listing_name = "Chopping Board", image ="https://img.freepik.com/free-photo/wood-cutting-board_1203-3148.jpg?t=st=1738937016~exp=1738940616~hmac=ffa2367ba27fed36015963353d65c4a50973931a35202392a1943abdc630938b&w=996", price = 3.00, condition = "Like New", category = "Other", description = "Hand-made wooden chopping board")
            db.session.add(listing_one)
            listing_two = ListingsModel(user_id = 1, listing_name = "Sofa", image = "https://img.freepik.com/free-photo/beautiful-interior-room-design-concept_23-2148786485.jpg?t=st=1738937245~exp=1738940845~hmac=d22d78f604dc8709293d294ab81ca42fe70a578bd3ad9c18f5a389bf064ccd31&w=996"  ,price = 20.50, condition = "Used", category = "Other", description = "Grey sofa made from real wool")
            db.session.add(listing_two)
            db.session.commit()

    except OperationalError as e:
        print(f"Error checking or creating tables: {e}")


if __name__ == '__main__':
    app.run(debug=True)

routes = ['change_listing', 'change_profile', 'get_seller_info','create_listing','get_product','make_profile','get_user_info','delete_listing','get_user_listings','get_listings','start_login']

@app.before_request
def check_login():
    if request.endpoint not in routes:

            try:
                print('I run')
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
    cs_ticket = uuid.uuid4().hex[:12]
    redirect_url = f'http://studentnet.cs.manchester.ac.uk/authenticate/?url=https://1b25-86-9-200-131.ngrok-free.app/profile&csticket={cs_ticket}&version=3&command=validate'

    res = {
        "auth_url": redirect_url,

    }
    return make_response(res)

@app.route('/protected', methods=['GET'])
def check_login():
    return make_response('I return',200)

@app.route('/listings', methods=['GET'])
def get_listings():
    listings = ListingsModel.query.all()  # Fetch all listings
    listings_data = [
        {
            "id": listing.id,
            "listing_name": listing.listing_name,
            "image": listing.image,
            "price": listing.price,
            "condition": listing.condition,
            "category": listing.category,
            "description": listing.description,
            "user_id": listing.user_id
        }
        for listing in listings
    ]
    return make_response({"listings": listings_data}, 200)

@app.route('/user_listings', methods=['GET'])
def get_user_listings():
    user_id = request.args.get('user_id', type=int)  # Get user_id from query parameters

    if not user_id:
        return make_response({"message": "User ID is required"}, 400)

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
            
        }
        for listing in listings
    ]

    return make_response({"listings": listings_data}, 200)

@app.route('/delete_listing/<int:listing_id>', methods=['DELETE'])
def delete_listing(listing_id):
    listing = ListingsModel.query.get(listing_id)

    if not listing:
        return make_response({"message": "Listing not found"}, 404)

    db.session.delete(listing)
    db.session.commit()

    return make_response({"message": "Listing deleted successfully"}, 200)


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

def make_profile(username,f_name,l_name):
    newUser = UserModel(first_name = f_name, last_name = l_name, username = username, phone_number = "", email_address = "")
    db.session.add(newUser)
    db.session.commit()

    return UserModel.query.filter_by(username=username).first()

    #need to add something here to continue execution of program

@app.route('/get_seller_info', methods=['GET'])
def get_seller_info():
    user_id = request.args.get('user_id', type=int)

    if not user_id:
        return make_response({"message": "User ID is required"}, 400)

    user = UserModel.query.filter_by(id=user_id).first()
    if not user:
        return make_response({"message": "User not found"}, 404)

    seller_data = {
        "first_name": user.first_name,
        "email": user.email_address,
        "phone_number": user.phone_number
    }

    return make_response({"seller": seller_data}, 200)

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
        }
        for listing in listings
    ]
    return make_response({"listings": listings_data}, 200)

@app.route('/create_listing', methods=['POST'])
def create_listing():

    listing_data = request.get_json()
    user_id = listing_data.get('user_id')
    name = listing_data.get('listing_name')
    image = listing_data.get('image')
    price = listing_data.get('price')
    condition= listing_data.get('condition')
    category= listing_data.get('category')
    description= listing_data.get('description')

    if not name or not price or not image:  # Validate required fields
        return make_response({"message": "Missing required fields"}, 400)






    new_listing = ListingsModel(user_id = user_id, listing_name = name, image = image  ,price = price, condition = condition, category = category, description = description)
    db.session.add(new_listing)
    db.session.commit()

    return make_response({"message": "Item uploaded successfully"}, 201)

@app.route('/edit_listing/<int:id>', methods=['PATCH'])
def change_listing(id):
    listing = ListingsModel.query.filter_by(id = id)
    if not listing:
        return make_response('user not found', 404)
    else:
        data = request.json
        new_listing_name = data.get('listing_name')
        new_listing_image = data.get('listing_image')
        new_listing_price = data.get('listing_price')
        if not new_listing_name or not new_listing_image or not new_listing_price:
            return make_response('listing_name, listing_image, listing_price are required', 400)
        else:
            listing.listing_name = new_listing_name
            listing.image = new_listing_image
            listing.price = new_listing_price
            listing_to_ret = {
                "id":listing.id,
                "listing_name":listing.listing_name,
                "image":listing.image,
                "price":listing.price,

            }
            respon_dict = {
                "status":'Successful',
                "user":listing_to_ret
            }
            db.session.commit()
            return make_response(respon_dict)
