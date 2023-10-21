from career import db,app
from enum import unique
from ssl import _create_unverified_context
from career import db,app,login_manager
from flask_login import UserMixin
from flask_table import Table, Col, LinkCol


@login_manager.user_loader
def load_user(id):
    return Register.query.get(int(id))


class Register(db.Model, UserMixin):
    id=db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    address= db.Column(db.String (80))
    email= db.Column(db.String(80))
    contact= db.Column(db.String(10))
    password = db.Column(db.String(80))
    usertype = db.Column(db.String(80))
   

