from models.index import db
from models.UserModel import UserModel
#from sqlalchemy import ForeignKey

class ListingsModel(db.Model):
    __tablename__ = 'listings_table'



    id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id = db.Column(db.Integer,db.ForeignKey('user_table.id'), nullable=False)
    listing_name = db.Column(db.String(200), nullable=False, unique = True)
    image = db.Column(db.LargeBinary, nullable=False, unique = True)
    price = db.Column(db.Float, nullable=False)



    def __repr__(self):
        return f"<ListingsModel Id:{self.id},UserID: {self.user_id},ListingName: {self.listing_name},Image:{len(self.image)} bytes,Price:{self.price} >"