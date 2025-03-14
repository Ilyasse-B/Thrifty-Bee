from models.index import db
from models.UserModel import UserModel
#from sqlalchemy import ForeignKey

class ContactModel(db.Model):
    __tablename__ = 'contact_table'


    id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id_contacted = db.Column(db.Integer,db.ForeignKey('user_table.id'), nullable=False)
    email = db.Column(db.String(500), nullable=False)
    reason = db.Column(db.String(500), nullable=False)
    


    def __repr__(self):
        return f"<ContactModel {self.id} >"