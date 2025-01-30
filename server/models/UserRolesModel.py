from models.index import db
from UserModel import UserModel
from RolesModel import RolesModel


class UserRolesModel(db.Model):
    __tablename__ = 'user_roles_table'



    user_id = db.Column(db.Integer,ForeignKey(UserModel.id) primary_key=True)
    role_id = db.Column(db.Integer,ForeignKey(RolesModel.id) primary_key=True)




    def __repr__(self):
        return f"<UserRolesModel {self.name}>"
