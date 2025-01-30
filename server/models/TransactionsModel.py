from models.index import db
from ListingsModel import ListingsModel
from UserModel import UserModel


class TransactionsModel(db.Model):
    __tablename__ = 'transactions_table'



    id = db.Column(db.Integer, primary_key=True)
    listing_id = db.Column(db.Integer,,ForeignKey(ListingsModel.id) primary_key=True)
    user_id = db.Column(db.Integer,ForeignKey(UserModel.id) ,primary_key=True)




    def __repr__(self):
        return f"<TransactionsModel {self.name}>"