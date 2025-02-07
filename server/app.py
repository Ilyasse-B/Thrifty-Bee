from flask import Flask, request, make_response
from models.index import db
from flask_cors import CORS
from sqlalchemy import and_

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
    db.create_all()
    userOne = UserModel(first_name = "John", last_name = "Smith", email_address = "john.smith@student.manchester.ac.uk")
    db.session.add(userOne)
    userTwo = UserModel(first_name = "Jenny", last_name = "Smith", email_address = "jenny.smith@student.manchester.ac.uk")
    db.session.add(userTwo)
    listing_one = ListingsModel ( user_id = 1, listing_name = "Chopping Board", image ="https://img.freepik.com/free-photo/wood-cutting-board_1203-3148.jpg?t=st=1738937016~exp=1738940616~hmac=ffa2367ba27fed36015963353d65c4a50973931a35202392a1943abdc630938b&w=996", price = 3.00)
    db.session.add(listing_one)
    listing_two = ListingsModel(user_id = 2, listing_name = "Sofa", image = "https://img.freepik.com/free-photo/beautiful-interior-room-design-concept_23-2148786485.jpg?t=st=1738937245~exp=1738940845~hmac=d22d78f604dc8709293d294ab81ca42fe70a578bd3ad9c18f5a389bf064ccd31&w=996" ,price = 20.50)
    db.session.add(listing_two)
    db.session.commit()

if __name__ == '__main__':
    app.run(debug=True)



@app.route('/dummy', methods=['GET'])
def teachers():

    return make_response('Dummy')

@app.route('/listings', methods=['GET'])
def get_listings():
    listings = ListingsModel.query.all()  # Fetch all listings
    listings_data = [
        {
            "id": listing.id,
            "listing_name": listing.listing_name,
            "image": listing.image,
            "price": listing.price
        }
        for listing in listings
    ]
    return make_response({"listings": listings_data}, 200)
