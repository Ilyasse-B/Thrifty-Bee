from models.index import db
from models.ReviewsModel import ReviewsModel
from models.UserModel import UserModel
#from sqlalchemy import ForeignKey

class ReportsReviewsModel(db.Model):
    __tablename__ = 'reports_reviews_table'


    id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id_who_reported = db.Column(db.Integer,db.ForeignKey('user_table.id'), nullable=False)
    review_id = db.Column(db.Integer,db.ForeignKey('reviews_table.id'), nullable=False)
    reason = db.Column(db.String(500), nullable = True)
    


    def __repr__(self):
        return f"<Reports Reviews Model {self.id} >"