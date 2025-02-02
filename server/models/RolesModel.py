from models.index import db



class RolesModel(db.Model):
    __tablename__ = 'roles_table'



    id = db.Column(db.Integer, primary_key=True, nullable=False)
    role_name = db.Column(db.String(100), nullable=False)



    def __repr__(self):
        return f"RolesModel {self.id}, {self.role_name}>"
