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
    listing_one = ListingsModel ( user_id = 1, listing_name = "Chopping Board", image =" https://www.freepik.com/free-photo/wood-cutting-board_1035116.htm#fromView=keyword&page=1&position=0&uuid=97ecb2a1-a2d0-45a5-ad2f-9566f3a5a1de&query=Cutting+Board", price = 3.00)
    db.session.add(listing_one)
    listing_two = ListingsModel(user_id = 2, listing_name = "Sofa", image = "https://www.freepik.com/free-photo/beautiful-interior-room-design-concept_11523457.htm#fromView=search&page=1&position=4&uuid=a1a510e5-2579-4891-bca8-90fa60260f69&query=Sofa" ,price = 20.50)
    db.session.add(listing_two)
    db.session.commit()

if __name__ == '__main__':
    app.run(debug=True)



@app.route('/intiate_login', methods=['GET'])
def teachers():
    cs_ticket = uuid.uuid4().hex[:12]
    redirect_url = f'http://studentnet.cs.manchester.ac.uk/authenticate/?url=https://8df5-130-88-226-30.ngrok-free.app/profile&csticket={cs_ticket}&version=3&command=validate'

    res = {
        "auth_url": redirect_url,
        "cs_ticket":cs_ticket
    }



    return make_response(res)
