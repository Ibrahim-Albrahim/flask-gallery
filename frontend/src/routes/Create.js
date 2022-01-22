import React, { useState } from 'react';
import ReactLoading from 'react-loading';
import '../scss/Create.scss';
import Footer from './components/Footer';
import { Button, Form } from 'react-bootstrap';


const Home = () => {
    const apiUrl = 'http://localhost:5000/'
    const [isUploading , setIsUploading] = useState({gallery: false , photo: false})
    const [galleryForm , setGalleryForm] = useState(new FormData())
    const [photoForm , setPhotoForm] = useState(new FormData())

    async function onGalleryFormSubmit (event) {
        event.preventDefault();
        setIsUploading({gallery: true})
        galleryForm.append('password' , document.getElementById('gallery-password').value)
        galleryForm.append('title' , document.getElementById('gallery-title').value)
        galleryForm.append('file' , document.getElementById('gallery-file').files[0])
        await fetch(apiUrl+'gallery/create' , {method: 'POST', body: galleryForm})
            .then(() => {
                setGalleryForm(new FormData())
                document.getElementById("add-gallery-form").reset();
                setIsUploading({gallery: false})
                return;
            })
    };

    async function onPhotoFormSubmit (event) {
        event.preventDefault();
        setIsUploading({photo: true})
        photoForm.append('password' , document.getElementById('photo-password').value)
        photoForm.append('galleryId' , document.getElementById('photo-gallery-id').value)
        var totalfiles = document.getElementById('photo-file').files.length;
        for (var index=0; index < totalfiles; index++){ photoForm.append('file' , document.getElementById('photo-file').files[index]) }
        await fetch(apiUrl+'photo/create' , {method: 'POST', body: photoForm})
            .then(() => {
                setPhotoForm(new FormData())
                document.getElementById("add-photo-form").reset();
                setIsUploading({photo: false})
                return;
            })
    };

    const loading = <ReactLoading type="spinningBubbles" color="#ffffff" height={200} width={200} className="loading-bubbles"/>;

    return (
        <div className="create-container">
            <section className='add-gallery-section'>
                {isUploading.gallery? loading : null}
                <h1>Add New Gallery</h1>
                <Form id="add-gallery-form" onSubmit={onGalleryFormSubmit.bind(this)} encType="multipart/form-data">
                    <Form.Label className='lbl'> <span>Title:</span>    <Form.Control id="gallery-title" type="text" placeholder="title" required /> </Form.Label>
                    <Form.Label className='lbl'> <span>Thumnail:</span> <Form.Control id="gallery-file" type="file" accept="image/*" required />     </Form.Label>
                    <Form.Label className='lbl'> <span>Password:</span> <Form.Control id="gallery-password" type="password" required />              </Form.Label>
                    <Button type="submit">Add Gallery</Button>
                </Form>
            </section>
            <section className='add-photo-section'>
                {isUploading.photo? loading : null}
                <h1>Add New Photo</h1>
                <Form id="add-photo-form" onSubmit={onPhotoFormSubmit.bind(this)} encType="multipart/form-data">
                    <Form.Label className='lbl'> <span>Gallery ID:</span> <Form.Control id="photo-gallery-id" type="number" placeholder="0" required />   </Form.Label>
                    <Form.Label className="lbl"> <span>Photo:</span>      <Form.Control id="photo-file" type="file" accept="image/*" required multiple /> </Form.Label>
                    <Form.Label className='lbl'> <span>Password:</span>   <Form.Control id="photo-password" type="password" required />                   </Form.Label>
                    <Button type="submit">Add Photo</Button>
                </Form>
            </section>
            <Footer />
        </div>
    );
}
export default Home;
