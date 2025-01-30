from models.index import db
from UserModel import UserModel

class ListingsModel(db.Model):
    __tablename__ = 'listings_table'



    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer,ForeignKey(UserModel.id), nullable=False)
    listing_name = db.Column(db.String(200), nullable=False, unique = True)
    image = db.Column(db.LargeBinary, nullable=False, unique = True)
    price = db.Column(db.Float, nullable=False)



    def __repr__(self):
        return f"<ListingsModel{self.name}>"