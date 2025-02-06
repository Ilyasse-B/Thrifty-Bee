from models.index import db

from models.ChatsModel import ChatsModel
from models.RolesModel import RolesModel
from models.TransactionsModel import TransactionsModel
from models.UserModel import UserModel
from models.UserRolesModel import UserRolesModel
from models.ListingsModel import ListingsModel
from models.MessagesModel import MessagesModel

userOne = UserModel(first_name = "John", last_name = "Smith", 
    email_address = "john.smith@student.manchester.ac.uk")
db.session.add(userOne)
userTwo = UserModel(first_name = "Jenny", last_name = "Smith", 
    email_address = "jenny.smith@student.manchester.ac.uk")
db.session.add(userTwo)
with open('Image.png', 'rb') as f:
    binary_data = f.read()
listing_one = ListingsModel ( listing_name = "Chopping Board", image = binary_data,
    price = 3.00)
db.session.add(listing_one)
with open('sofa.jpeg', 'rb') as f:
    binary_data = f.read()
listing_two = ListingsModel(listing_name = "Sofa", image = binary_data ,
    price = 20.50)
db.session.add(listing_two)