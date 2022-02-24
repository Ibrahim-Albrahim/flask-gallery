import os
from flask import (
    Flask,
    request,
    abort,
    make_response,
    jsonify
)
from flask_cors import CORS
from models import (Photo,Gallery, setup_db, db)
from flask_moment import Moment
import base64
from PIL import Image
import io

def create_app():
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

    def try_getexif(img, exif):
        try: return img.getexif()[exif]
        except: return "Unknown"

    @app.route('/api', methods=['GET'])
    def index():
        galleries=Gallery.query.all()
        data = []
        for gallery in galleries:
            data.append({
                'id': gallery.id,
                'title' : gallery.title,
                'small_size' : gallery.rendered_data})
        return jsonify(data)

    @app.route('/api/<gallery_id>' , methods=['GET'])
    def show_gallery(gallery_id):
        gallery = Gallery.query.get(gallery_id)
        data = []
        if gallery is None:
            data.append({
                'success': False,
                'gallery_title': '404'
            })
            abort(make_response(jsonify(data), 404))
        if len(gallery.photos) == 0:
            data.append({
                'success': False,
                'gallery_title': gallery.title
            })
            return jsonify(data)
        for photo in gallery.photos:
            data.append ({
                'success': True,
                'id': photo.id,
                'file_name' : photo.name,
                'small_size': photo.small_size, 
                'gallery_title': gallery.title,
            })
        return jsonify(data)

    @app.route('/api/gallery/create', methods=['POST'])
    def create_gallery():
        if request.form['password'] == 'PASSWORD' :
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
            except:
                db.session.rollback()
                abort(make_response(jsonify({"success": False}), 500))
            finally:
                db.session.close() 
        else : abort(make_response(jsonify({"success": False}), 404))

    @app.route('/api/gallery/<gallery_id>/edit', methods=['PATCH'])
    def edit_gallery(gallery_id):
        gallery = Gallery.query.get(gallery_id)

        if request.form['password'] == 'PASSWORD' :
            if gallery is None:
                abort(make_response(jsonify({"success": False}), 404))
            else:
                try:
                    file = request.files['file']
                    img_data = image_resize(file)
                    render_file = render_picture(img_data)
                    setattr(gallery, 'rendered_data', render_file)
                    setattr(gallery, 'name', file.filename)
                except : pass
                try:
                    title = request.form['title']
                    setattr(gallery, 'title' , title)
                except: pass
                try:
                    db.session.commit()
                    result = {"success": True}
                    return jsonify(result)
                except:
                    db.session.rollback()
                    abort(make_response(jsonify({"success": False}), 500))
                finally:
                    db.session.close()
        else: abort(make_response(jsonify({"success": False}), 404))     



    @app.route('/api/gallery/<gallery_id>/delete', methods=['POST'])
    def delete_gallery(gallery_id):
        if request.form['password'] == 'PASSWORD' :
            gallery = Gallery.query.get(gallery_id)
            if not gallery:
                abort(make_response(jsonify({"success": False}), 404))
            else:
                try:
                    db.session.delete(gallery)
                    db.session.commit()
                    result = {"success": True}
                    return jsonify(result)
                except:
                    db.session.rollback()
                    abort(make_response(jsonify({"success": False}), 500))
                finally:
                    db.session.close()
        else : abort(make_response(jsonify({"success": False}), 404))


    @app.route('/api/photo/<photo_id>', methods=['GET'])
    def show_photo(photo_id):
        photo = Photo.query.get(photo_id)
        data = []
        if photo is None:
            data.append({
                'success': False,
                'id': '404',
                'gallery_title': 404,
                'gallery_id': 404,
                
            })
            abort(make_response(jsonify(data), 404))

        gallery = Gallery.query.get(photo.gallery_id)
        data.append({
                'success': True,
                'id': photo.id,
                'gallery_id':photo.gallery_id,
                'gallery_title': gallery.title,
                'FileName' : photo.name,
                'DateTime': photo.date_time, 
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

    @app.route('/api/photo/create', methods=['POST'])
    def create_photo():
        if request.form['password'] == 'PASSWORD' :
            gallery_id = int(request.form['galleryId'])
            gallery = Gallery.query.get(gallery_id)
            if gallery is None:
                abort(make_response(jsonify({"success": False}), 404))
            files = request.files.getlist("file")
        else: abort(make_response(jsonify({"success": False}), 404))

        for file in files:
            data = file.read()
            full_size = render_picture(data)
            img_data = image_resize(file)
            small_size = render_picture(img_data)
            
            img = Image.open(file)
            img_size = str(img.width) +' X '+ str(img.height)

            photo = Photo()
            photo.name = file.filename
            photo.full_size = full_size
            photo.small_size = small_size
            photo.gallery_id = gallery_id
            photo.img_size=img_size
            photo.shutter= str(try_getexif(img, 37377))
            photo.aperture= str(try_getexif(img, 37378))
            photo.date_time= try_getexif(img, 306)
            photo.make= try_getexif(img, 271)
            photo.model= try_getexif(img, 272)
            photo.f_number= str(try_getexif(img, 33437))
            photo.lens_model= try_getexif(img, 0xA434)
            photo.software= try_getexif(img, 305)
            photo.lens_lenth= str(try_getexif(img, 41989))
            photo.iso_speed= str(try_getexif(img, 34867))

            try:
                db.session.add(photo)
            except:
                db.session.rollback()
                abort(make_response(jsonify({"success": False}), 500))

        db.session.commit()
        db.session.close()
        return jsonify({"success": True})

    @app.route('/api/photo/<photo_id>/edit', methods=['PATCH'])
    def edit_photo(photo_id):
        photo = Photo.query.get(photo_id)

        if request.form['password'] == 'PASSWORD' :
            if photo is None:
                abort(make_response(jsonify({"success": False}), 404))
            else:
                try:
                    new_gallery_id = request.form['new_gallery_id']
                    setattr(photo, 'gallery_id', new_gallery_id)
                except: new_gallery_id = photo.gallery_id
                
                gallery = Gallery.query.get(new_gallery_id)
                if gallery is None:
                    abort(make_response(jsonify({"success": False}), 404))

                try: 
                    file = request.files['file']
                    data = file.read()
                    full_size = render_picture(data)
                    img_data = image_resize(file)
                    small_size = render_picture(img_data)
                    img = Image.open(file)
                    img_size = str(img.width) +' X '+ str(img.height)   

                    setattr(photo, 'full_size', full_size)
                    setattr(photo, 'small_size', small_size)
                    setattr(photo, 'img_size', img_size)
                    setattr(photo, 'name', file.filename)
                    setattr(photo, 'shutter', str(try_getexif(img, 37377)))
                    setattr(photo, 'aperture', str(try_getexif(img, 37378)))
                    setattr(photo, 'date_time', try_getexif(img, 306))
                    setattr(photo, 'make', try_getexif(img, 271))
                    setattr(photo, 'model', try_getexif(img, 272))
                    setattr(photo, 'f_number', str(try_getexif(img, 33437)))
                    setattr(photo, 'lens_model', try_getexif(img, 0xA434))
                    setattr(photo, 'software', try_getexif(img, 305))
                    setattr(photo, 'lens_lenth', str(try_getexif(img, 41989)))
                    setattr(photo, 'iso_speed', str(try_getexif(img, 34867)))
                except: pass

                requested = ['img_size','name','shutter','aperture','date_time','make','model','f_number','lens_model','img_format','software','lens_lenth','iso_speed']
                for req in requested:
                        try: setattr(photo, req, request.form[req])
                        except: pass

                try:
                    db.session.commit()
                    return jsonify({"success": True})
                except:
                    db.session.rollback()
                    abort(make_response(jsonify({"success": False}), 500))
                finally:
                    db.session.close()
        else: abort(make_response(jsonify({"success": False}), 404))   

    @app.route('/api/photo/<photo_id>/delete', methods=['POST'])
    def delete_photo(photo_id):
        if request.form['password'] == 'PASSWORD' :
            photo = Photo.query.get(photo_id)
            if not photo:
                abort(make_response(jsonify({"success": False}), 404))
            else:
                try:
                    db.session.delete(photo)
                    db.session.commit()
                    result = {"success": True}
                    return jsonify(result)
                except:
                    db.session.rollback()
                    abort(make_response(jsonify({"success": False}), 500))
                finally:
                    db.session.close()
        else : abort(make_response(jsonify({"success": False}), 404))
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0')