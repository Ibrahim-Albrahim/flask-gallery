from itertools import count
import os
from flask import (Flask,
                request,
                flash,
                redirect,
                url_for,
                abort,
                jsonify)
from flask_cors import CORS
from models import (Photo,Gallery, setup_db, db)
from flask_moment import Moment
import base64
from PIL import Image
import io

app = Flask(__name__)
moment = Moment(app)

setup_db(app)
app.secret_key = os.urandom(32)
CORS(app)

def render_picture(data):
    render_pic = base64.b64encode(data).decode('ascii') 
    return render_pic

def image_resize(file, size=1000):
    img = Image.open(file)
    img.load()
    img.split()
    img_size = img.size
    img_ratio = size/img_size[0]
    img.thumbnail((img_size[0]*img_ratio, img_size[1]*img_ratio), Image.ANTIALIAS)
    return image_to_bytes(img)

def image_to_bytes(image):
    stream = io.BytesIO()
    image.save(stream, format='PNG')
    return stream.getvalue()

@app.route('/', methods=['GET'])
def index():
    galleries=Gallery.query.all()
    data = []
    for gallery in galleries:
        data.append({
            'id': gallery.id,
            'title' : gallery.title,
            'img' : gallery.rendered_data})
    return jsonify(data)

@app.route('/<gallery_id>' , methods=['GET'])
def show_gallery(gallery_id):
  gallery = Gallery.query.get(gallery_id)
  data = []
  for photo in gallery.photos:
    gallery = Gallery.query.get(photo.gallery_id)
    data.append ({
        'id': photo.id,
        'file_name' : photo.name,
        'small_size': photo.small_size, 
        'gallery_title': gallery.title,
    })
  return jsonify(data)

@app.route('/gallery/create', methods=['POST'])
def create_gallery():
   if request.form['password'] == '' :
    title = request.form['title']
    file = request.files['file']
    img_data = image_resize(file)
    render_file = render_picture(img_data)

    try:
        newFile = Gallery(name=file.filename, rendered_data=render_file, title=title)
        db.session.add(newFile)
        db.session.commit() 
        result = {"success": True}
        return jsonify(result)
    except ImportError:
        db.session.rollback()
        result = {"success": False}
        return jsonify(result)
    finally:
        db.session.close() 
   else : abort(404)

@app.route('/<gallery_id>/edit', methods=['PATCH','POST'])
def edit_gallery_submission(gallery_id):
    gallery = Gallery.query.get(gallery_id)
    gallery.title = request.form['title']
    
    if not gallery:
        return redirect(url_for('index'))
    else:
        error_on_delete = False
        gallery_title = gallery.title
        try:
            db.session.commit()
        except:
            error_on_delete = True
            db.session.rollback()
        finally:
            db.session.close()
        if error_on_delete:
            abort(500)
        else:
            result = {"success": True}
            return jsonify(result) 

@app.route('/gallery/<gallery_id>/delete', methods=['DELETE','GET'])
def delete_gallery(gallery_id):
    gallery = Gallery.query.get(gallery_id)
    if not gallery:
        result = {"success": False}
        return jsonify(result)
    else:
        error_on_delete = False
        try:
            db.session.delete(gallery)
            db.session.commit()
        except:
            error_on_delete = True
            db.session.rollback()
        if error_on_delete:
            abort(500)
        else:
            result = {"success": True}
            return jsonify(result)

@app.route('/photo/<photo_id>', methods=['GET'])
def show_photo(photo_id):
    photo = Photo.query.get(photo_id)
    data =  ({
            'id': photo.id,
            'gallery_id':photo.gallery_id,
            'FileName' : photo.name,
            'DateTime': photo.date_time, 
            'ImageFormat': photo.img_format, 
            'Size': photo.img_size, 
            'Make': photo.make +' '+'('+ str(photo.model)+')', 
            'Model': photo.lens_model, 
            'Software': photo.software, 
            'ShutterSpeedValue': photo.shutter, 
            'ApertureValue': photo.aperture, 
            'FocalLengthIn35mmFilm': photo.lens_lenth, 
            'FNumber': photo.f_number, 
            'ISO': photo.iso_speed, 
            'full_size' : photo.full_size,
        })
    return jsonify(data)

@app.route('/photo/create', methods=['POST'])
def create_photo():
   if request.form['password'] == '' :
    gallery_id = int(request.form['galleryId'])
    files = request.files.getlist("file")
   else: abort(404)

   for file in files:
    data = file.read()
    full_size = render_picture(data)
    img_data = image_resize(file)
    small_size = render_picture(img_data)
    
    img = Image.open(file)
    img_size = str(img.width) +' X '+ str(img.height)   
    try:shutter = img.getexif()[37377]
    except:shutter = ""
    try:aperture = img.getexif()[37378]
    except :aperture = ""
    try:date_time = img.getexif()[306]
    except : date_time = ""
    try:make = img.getexif()[271]
    except : make = ""
    try:model = img.getexif()[272]
    except : model = ""
    try:f_number = img.getexif()[33437]
    except : f_number = ""
    try:lens_model = img.getexif()[0xA434]
    except : lens_model = ""
    try:img_format = img.format
    except : img_format = ""
    try:software = img.getexif()[305]
    except : software = ''
    try:lens_lenth = img.getexif()[41989]
    except:lens_lenth = 0
    try:iso_speed = img.getexif()[34867]
    except: iso_speed = 0

    photo = Photo()
    photo.name = file.filename
    photo.full_size = full_size
    photo.small_size = small_size
    photo.gallery_id = gallery_id
    photo.shutter = str(shutter)
    photo.aperture=str(aperture)
    photo.date_time=date_time
    photo.img_size=img_size
    photo.make=make
    photo.model=model
    photo.f_number=str(f_number)
    photo.lens_model=lens_model
    photo.img_format=img_format  
    photo.lens_lenth=str(lens_lenth)
    photo.iso_speed=str(iso_speed)
    photo.software=software
    try:
        db.session.add(photo)
    except:db.session.rollback()

   db.session.commit() 
   db.session.close() 
   result = {"success": True}
   return jsonify(result)
    


@app.route('/photo/<photo_id>/delete', methods=['DELETE','GET'])
def delete_photo(photo_id):
    photo = Photo.query.get(photo_id)
    if not photo:
        return redirect(url_for('index'))
    else:
        error_on_delete = False
        try:
            db.session.delete(photo)
            db.session.commit()
        except:
            error_on_delete = True
            db.session.rollback()
        finally:
            db.session.close()
        if error_on_delete:
            abort(500)
        else:
            result = {"success": True}
            return jsonify(result)


if __name__ == '__main__':
    app.run(host="31.220.62.4" , cert="adhoc")