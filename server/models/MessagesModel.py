from models.index import db
from ChatsModel import ChatsModel
from UserModel import UserModel



class MessagesModel(db.Model):
    __tablename__ = 'messages_table'



    id = db.Column(db.Integer, primary_key=True)
    chat_id = db.Column (db.Integer,ForeignKey(ChatsModel.id), primary_key=True)
    user_id = db.Column (db.Integer,ForeignKey(UserModel.id), primary_key=True)
    last_name = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Double, nullable=False)
    timestamp = db.Column(db.Datetime, nullable=False)
    read = db.Column(db.Boolean, nullable=False)




    def __repr__(self):
        return f"<MessagesModel {self.name}>"