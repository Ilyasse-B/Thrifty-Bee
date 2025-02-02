from models.index import db
from models.UserModel import UserModel
from models.RolesModel import RolesModel
#from sqlalchemy import ForeignKey


class UserRolesModel(db.Model):
    __tablename__ = 'user_roles_table'



    user_id = db.Column(db.Integer,db.ForeignKey('user_table.id') ,primary_key=True , nullable=False)
    role_id = db.Column(db.Integer,db.ForeignKey('roles_table.id') ,primary_key=True , nullable=False)




    def __repr__(self):
        return f"<UserRolesModel UserId :{self.user_id}, RoleID : {self.role_id}>"
