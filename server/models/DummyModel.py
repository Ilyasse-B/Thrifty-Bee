from models.index import db



class DummyModel(db.Model):
    __tablename__ = 'dummy table'



    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)




    def __repr__(self):
        return f"<DummyModel {self.name}>"