from models.index import db
from models.UserModel import UserModel
#from sqlalchemy import ForeignKey

class FeedbackModel(db.Model):
    __tablename__ = 'feedback_table'


    id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id_contacted = db.Column(db.Integer,db.ForeignKey('user_table.id'), nullable=False)
    #email = db.Column(db.String(500), nullable=False)
    category = db.Column(db.String(500), nullable=False)
    feedback = db.Column(db.String(500), nullable=False)
    read = db.Column (db.Boolean, nullable = False, default=False)


    def __repr__(self):
        return f"<FeedbackModel {self.id} >"