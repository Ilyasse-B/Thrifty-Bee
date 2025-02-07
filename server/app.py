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

if __name__ == '__main__':
    app.run(debug=True)



@app.route('/intiate_login', methods=['GET'])
def teachers():
    cs_ticket = uuid.uuid4().hex[:12]
    redirect_url = f'http://studentnet.cs.manchester.ac.uk/authenticate/?url=https://e185-130-88-226-8.ngrok-free.app/profile&csticket={cs_ticket}&version=3&command=validate'

    res = {
        "auth_url": redirect_url,
        "cs_ticket":cs_ticket
    }



    return make_response(res)