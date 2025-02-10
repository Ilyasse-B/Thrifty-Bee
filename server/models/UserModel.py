from models.index import db



class UserModel(db.Model):
    __tablename__ = 'user_table'



    id = db.Column(db.Integer, primary_key=True , nullable=False, unique = True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    #username = db.Column(db.String(100), nullable=False, unique = True)
    #phone_number = db.Column(db.String(100), nullable=False)
    email_address = db.Column(db.String(200), nullable=False, unique = True)


    def __repr__(self):
        return f"<UserModel {self.id} First Name :{self.first_name} Last Name :{self.last_name}>"
