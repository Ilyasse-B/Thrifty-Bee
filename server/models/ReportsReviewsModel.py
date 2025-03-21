from models.index import db
from models.ReviewsModel import ReviewsModel
from models.UserModel import UserModel
#from sqlalchemy import ForeignKey

class ReportsReviewsModel(db.Model):
    __tablename__ = 'reports_reviews_table'


    id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id_who_reported = db.Column(db.Integer,db.ForeignKey('user_table.id'), nullable=False)
    reviwer_firstname = db.Column(db.String(500), nullable = False)
    reviewed_firstname = db.Column(db.String(500), nullable = False)
    details = db.Column(db.String(1000), nullable = False)
    solved = db.Column (db.Boolean, nullable = False, default=False)


    def __repr__(self):
        return f"<Reports Reviews Model {self.id} >"