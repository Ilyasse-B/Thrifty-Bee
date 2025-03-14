from models.index import db
from models.ListingsModel import ListingsModel
from models.UserModel import UserModel
#from sqlalchemy import ForeignKey

class ReportsListingModel(db.Model):
    __tablename__ = 'reports_listing_table'


    id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id_reported = db.Column(db.Integer,db.ForeignKey('user_table.id'), nullable=False)
    listing_id = db.Column(db.Integer,db.ForeignKey('listings_table.id'), nullable=False)
    reason = db.Column(db.String(500), nullable = True)
    solved = db.Column (db.Boolean, nullable = False, default=False)

    


    def __repr__(self):
        return f"<Reports Listings Model {self.id} >"