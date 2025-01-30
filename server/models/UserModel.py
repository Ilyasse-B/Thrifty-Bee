from models.index import db



class UserModel(db.Model):
    __tablename__ = 'user_table'



    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email_address = db.Column(db.String(200), nullable=False)
    password = db.Column(db.String(100), nullable=False)




    def __repr__(self):
        return f"<UserModel {self.name}>"
