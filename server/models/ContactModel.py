from models.index import db
from models.UserModel import UserModel
#from sqlalchemy import ForeignKey

class ContactModel(db.Model):
    __tablename__ = 'contact_table'


    id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id_contacted = db.Column(db.Integer,db.ForeignKey('user_table.id'), nullable=True)
    name = db.Column(db.String(500), nullable=True)
    email = db.Column(db.String(500), nullable=True)
    reason = db.Column(db.String(500), nullable=False)
    moderator_response = db.Column(db.String(1000), nullable=False, default = "")
    responded = db.Column (db.Boolean, nullable = False, default=False)
    timestamp = db.Column(db.DateTime, nullable=False)



    


    def __repr__(self):
        return f"<ContactModel {self.id} >"