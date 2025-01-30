from models.index import db
from ListingsModel import ListingsModel



class ChatsModel(db.Model):
    __tablename__ = 'chats_table'


    id = db.Column(db.Integer, primary_key=True)
    listing_id = db.Column(db.Integer,ForeignKey(ListingsModel.id), primary_key=True)
    active = db.Column(db.Boolean, nullable=False)



    def __repr__(self):
        return f"<ChatsModel {self.name}>"