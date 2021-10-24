import os
from flask import (Flask,
                render_template,
                request,
                flash,
                redirect,
                url_for,
                session,
                abort,
                jsonify,
                _request_ctx_stack)
from flask_cors import CORS
from models import Photo,Gallery, setup_db, db
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
            'img' : gallery.rendered_data
        })
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
        'full_size' : photo.full_size,
    })

  return jsonify(data)

@app.route('/gallery/create', methods=['POST'])
def create_gallery():
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
            flash(f'An error occurred editing gallery {gallery_title}.')
            print("Error in edit_gallery()")
            abort(500)
        else:
            return redirect(url_for('index')) 

@app.route('/gallery/<gallery_id>/delete', methods=['DELETE','GET'])
def delete_gallery(gallery_id):
    gallery = Gallery.query.get(gallery_id)
    if not gallery:
        return redirect(url_for('index'))
    else:
        error_on_delete = False
        gallery_title = gallery.title
        try:
            db.session.delete(gallery)
            db.session.commit()
        except:
            error_on_delete = True
            db.session.rollback()
        finally:
            db.session.close()
        if error_on_delete:
            flash(f'An error occurred deleting gallery {gallery_title}.')
            print("Error in delete_gallery()")
            abort(500)
        else: return redirect(url_for('index')) 


@app.route('/photo/create', methods=['POST'])
def create_photo():
   gallery_id = int(request.form['galleryId'])
   file = request.files['file']
   data = file.read()
   full_size = render_picture(data)

   img_data = image_resize(file)
   small_size = render_picture(img_data)
   
   

   newFile = Photo(name=file.filename, small_size=small_size, full_size=full_size, gallery_id=gallery_id)

   try:
    db.session.add(newFile)
    db.session.commit() 
    flash(f'photo added successfully.')

   except:
    db.session.rollback()
    flash(f'An error occurred adding photo.')
   finally:
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
            flash(f'An error occurred deleting photo {photo_id}.')
            print("Error in delete_photo()")
            abort(500)
        else:
            return redirect(url_for('index')) 


if __name__ == '__main__':
    app.run()