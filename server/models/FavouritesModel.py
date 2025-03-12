from models.index import db
from models.ListingsModel import ListingsModel
from models.UserModel import UserModel

class FavouritesModel(db.Model):
    __tablename__ = 'favourites_table'

    user_id = db.Column(db.Integer,db.ForeignKey('user_table.id'), primary_key=True,nullable=False)
    listings_id = db.Column(db.Integer,db.ForeignKey('listings_table.id'), primary_key=True,nullable=False)
   

    def __repr__(self):
        return f"<FavouritesModel ,Listing ID {self.listing_id} User ID{self.user_id}>"