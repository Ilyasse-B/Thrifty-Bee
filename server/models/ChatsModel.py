from models.index import db
from models.ListingsModel import ListingsModel
from models.UserModel import UserModel
#from sqlalchemy import ForeignKey

class ChatsModel(db.Model):
    __tablename__ = 'chats_table'


    id = db.Column(db.Integer, primary_key=True, nullable=False)
    listing_id = db.Column(db.Integer,db.ForeignKey('listings_table.id'), nullable=False)
    active = db.Column(db.Boolean, nullable=False)
    #May not need this line only because listings akready contains that person's user id - user_to_sell = db.Column(db.Integer,db.ForeignKey('user_table.id') , nullable=False)
    user_to_buy = db.Column(db.Integer,db.ForeignKey('user_table.id') , nullable=False)
    seller_confirmed = db.Column(db.Boolean, nullable=False)
    buyer_confirmed = db.Column(db.Boolean, nullable=False)


    def __repr__(self):
        return f"<ChatsModel {self.id} Listing ID {self.listing_id} Active {self.active}>"