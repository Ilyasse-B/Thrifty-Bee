from models.index import db
from models.ListingsModel import ListingsModel
from models.UserModel import UserModel


class TransactionsModel(db.Model):
    __tablename__ = 'transactions_table'



    id = db.Column(db.Integer, primary_key=True, nullable=False )
    listing_id = db.Column(db.Integer,db.ForeignKey( 'listings_table.id'), nullable=False)
    user_id_bought = db.Column(db.Integer,db.ForeignKey('user_table.id') , nullable=False)
    #payment_type = db.Column(db.String,nullable=False )
    #pending?

    




    def __repr__(self):
        return f"<TransactionsModel {self.id} Listing Id {self.listing_id} User {self.user_id}>"