import React, { useState, useEffect }  from 'react';
import { useParams } from 'react-router-dom';
import '../scss/ViewGallery.scss'
import { apiUrl } from '../config';
import Sliders from './components/Sliders';
import Loading from './components/Loading';



const ViewGallery = () => {
    const [photos , setPhotos] = useState({photos:[], isLoaded : false});
    let { galleryId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            await fetch(apiUrl+`${galleryId}`)
                .then(response => response.json())
                .then(json => {
                  try {setPhotos({photos: json , isLoaded : true})} 
                  catch {}
                });
        };
    
        fetchData();
      },[galleryId]);

    return (
      <div className='view-gallery-container'>
        {photos.isLoaded? <Sliders imgs={photos.photos} link={'/photo/'} /> : <Loading />}
      </div>
    )
};
export default ViewGallery;