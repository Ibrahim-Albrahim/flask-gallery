import os
from turtle import title
from flask import (Flask,
                request,
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
                abort(500)
            finally:
                db.session.close() 
        else : abort(404)

    @app.route('/gallery/<gallery_id>/edit', methods=['PATCH'])
    def edit_gallery(gallery_id):
        gallery = Gallery.query.get(gallery_id)

        if request.form['password'] == 'PASSWORD' :
            if gallery is None:
                abort(404)
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
                    abort(500)
                finally:
                    db.session.close()
        else: abort(404)        



    @app.route('/gallery/<gallery_id>/delete', methods=['POST'])
    def delete_gallery(gallery_id):
        if request.form['password'] == 'PASSWORD' :
            gallery = Gallery.query.get(gallery_id)
            if not gallery:
                print('Gallery '+gallery_id+" not found.")
                abort(404)
            else:
                try:
                    db.session.delete(gallery)
                    db.session.commit()
                except:
                    abort(500)
                    db.session.rollback()
                finally:
                    db.session.close()
                    result = {"success": True}
                    return jsonify(result)
        else : abort(404)


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
        if request.form['password'] == 'PASSWORD' :
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
            except : software = ""
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
            except:
                db.session.rollback()

        db.session.commit() 
        db.session.close() 
        result = {"success": True}
        return jsonify(result)

    @app.route('/photo/<photo_id>/edit', methods=['PATCH'])
    def edit_photo(photo_id):
        photo = Photo.query.get(photo_id)

        if request.form['password'] == 'PASSWORD' :
            if photo is None:
                abort(404)
            else:
                try:
                    new_gallery_id = request.form['new_gallery_id']
                    setattr(photo, 'gallery_id', new_gallery_id)
                except: pass

                try: 
                    file = request.files['file']
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
                    except : software = ""
                    try:lens_lenth = img.getexif()[41989]
                    except:lens_lenth = 0
                    try:iso_speed = img.getexif()[34867]
                    except: iso_speed = 0

                    setattr(photo, 'full_size', full_size)
                    setattr(photo, 'small_size', small_size)
                    setattr(photo, 'img_size', img_size)
                    setattr(photo, 'name', file.filename)
                    setattr(photo, 'shutter', str(shutter))
                    setattr(photo, 'aperture', str(aperture))
                    setattr(photo, 'date_time', date_time)
                    setattr(photo, 'make', make)
                    setattr(photo, 'model', model)
                    setattr(photo, 'f_number', str(f_number))
                    setattr(photo, 'lens_model', lens_model)
                    setattr(photo, 'img_format', img_format)
                    setattr(photo, 'software', software)
                    setattr(photo, 'lens_lenth', str(lens_lenth))
                    setattr(photo, 'iso_speed', str(iso_speed))
                except: pass
                try:
                    img_size = request.form['img_size']
                    setattr(photo, 'img_size', str(img_size))
                except : pass
                try:
                    name = request.form['name']
                    setattr(photo, 'name', str(name))
                except : pass
                try:
                    shutter = request.form['shutter']
                    setattr(photo, 'shutter', str(shutter))
                except : pass
                try:
                    aperture = request.form['aperture']
                    setattr(photo, 'aperture', str(aperture))
                except : pass
                try:
                    date_time = request.form['date_time']
                    setattr(photo, 'date_time', str(date_time))
                except : pass
                try:
                    make = request.form['make']
                    setattr(photo, 'make', str(make))
                except : pass
                try:
                    model = request.form['model']
                    setattr(photo, 'model', str(model))
                except : pass
                try:
                    f_number = request.form['f_number']
                    setattr(photo, 'f_number', str(f_number))
                except : pass
                try:
                    lens_model = request.form['lens_model']
                    setattr(photo, 'lens_model', str(lens_model))
                except : pass
                try:
                    img_format = request.form['img_format']
                    setattr(photo, 'img_format', str(img_format))
                except : pass
                try:
                    software = request.form['software']
                    setattr(photo, 'software', str(software))
                except : pass
                try:
                    lens_lenth = request.form['lens_lenth']
                    setattr(photo, 'lens_lenth', str(lens_lenth))
                except : pass
                try:
                    iso_speed = request.form['iso_speed']
                    setattr(photo, 'iso_speed', str(iso_speed))
                except : pass


                try:
                    db.session.commit()
                    result = {"success": True}
                    return jsonify(result)
                except:
                    db.session.rollback()
                    abort(500)
                finally:
                    db.session.close()
        else: abort(404)    

    @app.route('/photo/<photo_id>/delete', methods=['POST'])
    def delete_photo(photo_id):
        if request.form['password'] == 'PASSWORD' :
            photo = Photo.query.get(photo_id)
            if not photo:
                print('Photo '+photo_id+" not found.")
                abort(404)
            else:
                try:
                    db.session.delete(photo)
                    db.session.commit()
                except:
                    abort(500)
                    db.session.rollback()
                finally:
                    db.session.close()
                    result = {"success": True}
                    return jsonify(result)
        else : abort(404)
    return app

if __name__ == '__main__':
    app = create_app()
    app.run()