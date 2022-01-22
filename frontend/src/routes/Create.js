import React, { useState } from 'react';
import ReactLoading from 'react-loading';
import '../scss/Create.scss';
import Footer from './components/Footer';
import { Button, Form } from 'react-bootstrap';


const Home = () => {
    const apiUrl = 'http://localhost:5000/'
    const [isUploading , setIsUploading] = useState({isUploading: false})
    const [galleryForm] = useState(new FormData())
    const [photoForm] = useState(new FormData())

    async function onGalleryFormSubmit (event) {
        event.preventDefault();
        setIsUploading({isUploading: true})
        galleryForm.append('password' , document.getElementById('gallery-password').value)
        galleryForm.append('title' , document.getElementById('gallery-title').value)
        galleryForm.append('file' , document.getElementById('gallery-file').files[0])
        await fetch(apiUrl+'gallery/create' , {method: 'POST', body: galleryForm})
            .then(() => {
                document.getElementById("add-gallery-form").reset();
                setIsUploading({isUploading: false})
                return;
            })
    };

    async function onPhotoFormSubmit (event) {
        event.preventDefault();
        setIsUploading({isUploading: true})
        photoForm.append('password' , document.getElementById('photo-password').value)
        photoForm.append('galleryId' , document.getElementById('photo-gallery-id').value)
        var totalfiles = document.getElementById('photo-file').files.length;
        for (var index=0; index < totalfiles; index++){ photoForm.append('file' , document.getElementById('photo-file').files[index]) }
        await fetch(apiUrl+'photo/create' , {method: 'POST', body: photoForm})
            .then(() => {
                document.getElementById("add-photo-form").reset();
                setIsUploading({isUploading: false})
                return;
            })
    };

    return (
        <div className="create-container">
            <section className='add-gallery-section'>
                <h1>Add New Gallery</h1>
                <Form id="add-gallery-form" onSubmit={onGalleryFormSubmit.bind(this)} encType="multipart/form-data">
                    <Form.Label >Gallery title:</Form.Label>
                    <Form.Control id="gallery-title" type="text" placeholder="title" required />
                    <Form.Label >Gallery photo:</Form.Label>
                    <Form.Control type="file" id="gallery-file" name="inputFile" accept="image/*" required/>
                    <Form.Label>password:</Form.Label>
                    <Form.Control type="password" id="gallery-password" required />
                    <Button type="submit">Add Gallery</Button>
                </Form>
            </section>
            <section className='add-photo-section'>
                <h1>Add New Photo</h1>
                <Form id="add-photo-form" onSubmit={onPhotoFormSubmit.bind(this)} encType="multipart/form-data">
                    <Form.Label>Gallery Id:</Form.Label>
                    <Form.Control id="photo-gallery-id" type="number" placeholder="0" required />
                    <Form.Label>photo:</Form.Label>
                    <Form.Control id="photo-file" type="file" accept="image/*" required multiple/>
                    <Form.Label>password:</Form.Label>
                    <Form.Control id="photo-password" type="password" required />
                    <Button type="submit">Add Photo</Button>
                </Form>
            </section>
            <Footer />
        </div>
    );
}


export default Home;
