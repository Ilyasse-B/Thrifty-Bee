from models.index import db
from models.UserModel import UserModel

class ReviewsModel(db.Model):
    __tablename__ = 'reviews_table'

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_made_review = db.Column(db.Integer,db.ForeignKey('user_table.id') , nullable=False)
    rating = db.Column(db.Integer, nullable = False)
    description = db.Column(db.String(500), nullable = True)
    user_seller = db.Column(db.Integer,db.ForeignKey('user_table.id') , nullable=False)


    def __repr__(self):
        return f"<ReviewsModel {self.id} User who reviewed {self.user_made_review} User who sold {self.user_seller}>"