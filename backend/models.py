from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, ForeignKey
from sqlalchemy.orm import relationship

DB_PATH = 'postgresql://postgres:1234@localhost:5432/gallery'
app = Flask(__name__)
db = SQLAlchemy()

def setup_db(app):
    app.config["SQLALCHEMY_DATABASE_URI"] = DB_PATH
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.app = app
    Migrate(app, db)
    db.init_app(app)
    db.create_all()
    
class Gallery(db.Model):
    __tablename__ = 'Gallery'
    id = db.Column(db.Integer,  primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(128), nullable=False)
    rendered_data = db.Column(db.Text, nullable=False)
    photos = relationship("Photo", back_populates="gallery")

    def __repr__(self):
        return f'Gallery Id: {self.id} Gallery Name: {self.title} Thumnail: {self.rendered_data}'

class Photo(db.Model):
    __tablename__ = 'Photo'
    id = db.Column(db.Integer,  primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    full_size = db.Column(db.Text, nullable=False)
    small_size = db.Column(db.Text, nullable=False)
    gallery_id = db.Column(Integer, ForeignKey('Gallery.id'))
    gallery = relationship("Gallery", back_populates="photos")
    img_size = db.Column(db.Text, nullable=True)
    shutter = db.Column(db.Text, nullable=True)
    aperture = db.Column(db.Text, nullable=True)
    date_time = db.Column(db.Text, nullable=True)
    make = db.Column(db.Text, nullable=True)
    model = db.Column(db.Text, nullable=True)
    f_number = db.Column(db.Text, nullable=True)
    lens_model = db.Column(db.Text, nullable=True)
    img_format = db.Column(db.Text, nullable=True)
    software = db.Column(db.Text, nullable=True)
    lens_lenth = db.Column(db.Text, nullable=True)    
    iso_speed = db.Column(db.Text, nullable=True)    

    def __repr__(self):
        return f'Photo Id: {self.id} Pic Name: {self.name} Photo: {self.full_size} Gallery: {self.gallery} '


