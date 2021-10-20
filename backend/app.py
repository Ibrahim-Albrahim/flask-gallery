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



app = Flask(__name__)
moment = Moment(app)

setup_db(app)
app.secret_key = os.urandom(32)
CORS(app)

def render_picture(data):
    render_pic = base64.b64encode(data).decode('ascii') 
    return render_pic

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
        'img': photo.rendered_data,
    })

  return jsonify(data)

@app.route('/gallery/create', methods=['POST'])
def create_gallery():
   file = request.files['file']
   data = file.read()
   render_file = render_picture(data)
   title = request.form['title']

   try:
    newFile = Gallery(name=file.filename, data=data, rendered_data=render_file, title=title)
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
   file = request.files['file']
   data = file.read()
   render_file = render_picture(data)
   gallery_id = int(request.form['galleryId'])

   newFile = Photo(name=file.filename, data=data, rendered_data=render_file, gallery_id=gallery_id)

   try:
    db.session.add(newFile)
    db.session.commit() 
    flash(f'photo added successfully.')

   except:
    db.session.rollback()
    flash(f'An error occurred adding photo.')
   finally:
       db.session.close() 


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


# Show in json 

@app.route('/json', methods=['GET'])
def show_galleries_json():
    galleries=Gallery.query.all()
    data = []
    for gallery in galleries:
        data.append({
            'id': gallery.id,
            'title' : gallery.title,
            'img' : gallery.rendered_data
        })
    return jsonify(data)


@app.route('/<gallery_id>/json' , methods=['GET'])
def show_gallery_json(gallery_id):
  gallery = Gallery.query.get(gallery_id)
  data = []
  for photo in gallery.photos:
    gallery = Gallery.query.get(photo.gallery_id)
    data.append ({
        'id': photo.id,
        'file_name' : photo.name,
        'img': photo.rendered_data,
    })

  return jsonify(data)

@app.route('/gallery/create/json', methods=['POST'])
def create_gallery_json():
   file = request.files['file']
   data = file.read()
   render_file = render_picture(data)
   title = request.form['title']

   try:
    newFile = Gallery(name=file.filename, data=data, rendered_data=render_file, title=title)
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


@app.route('/photo/create/json', methods=['POST'])
def create_photo_json():
   file = request.files['file']
   data = file.read()
   render_file = render_picture(data)
   gallery_id = int(request.form['galleryId'])

   newFile = Photo(name=file.filename, data=data, rendered_data=render_file, gallery_id=gallery_id)

   try:
    db.session.add(newFile)
    db.session.commit() 
    flash(f'photo added successfully.')

   except:
    db.session.rollback()
    flash(f'An error occurred adding photo.')
   finally:
       db.session.close() 


   return redirect(url_for('index')) 

if __name__ == '__main__':
    app.run(host='192.168.43.41', port=5000, debug=True)