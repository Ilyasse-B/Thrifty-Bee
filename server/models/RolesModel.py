from models.index import db



class RolesModel(db.Model):
    __tablename__ = 'user_table'



    id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(100), nullable=False)



    def __repr__(self):
        return f"RolesModel {self.name}>"
