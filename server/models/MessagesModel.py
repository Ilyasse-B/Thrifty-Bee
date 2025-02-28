from models.index import db
from models.ChatsModel import ChatsModel
from models.UserModel import UserModel
#from sqlalchemy import ForeignKey



class MessagesModel(db.Model):
    __tablename__ = 'messages_table'



    id = db.Column(db.Integer, primary_key=True, nullable=False)
    chat_id = db.Column (db.Integer,db.ForeignKey('chats_table.id'),nullable=False)
    user_id = db.Column (db.Integer,db.ForeignKey('user_table.id'),nullable=False)
    content = db.Column(db.Boolean, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    #read = db.Column(db.Boolean, nullable=False)




    def __repr__(self):
        return f"<MessagesModel {self.id},{self.chat_id},{self.user_id},{self.content},{self.timestamp},{self.read}>"