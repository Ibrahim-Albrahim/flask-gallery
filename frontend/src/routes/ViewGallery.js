import React, { useState, useEffect }  from 'react';
import { useParams , Navigate  } from 'react-router-dom';
import '../scss/ViewGallery.scss'
import { apiUrl } from '../config';
import Sliders from './components/Sliders';
import Loading from './components/Loading';
import Header from './components/Header';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons'
import GalleryEmpty from './components/GalleryEmpty';


const ViewGallery = () => {
    const [photos , setPhotos] = useState({photos:[], isLoaded : false , success: null , headerText : ''});
    let { galleryId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            await fetch(apiUrl+`${galleryId}`)
                .then(response => response.json())
                .then(json => { setPhotos({photos: json , isLoaded : true , success: json[0].success , headerText : json[0].gallery_title}) })
        };
    
        fetchData();
      },[galleryId]);

    return (
      <div className='view-gallery-container'>
        <Header headerText={ galleryId +' | '+ photos.headerText }  icon={faArrowAltCircleLeft} headerLink='/'/>
        {
        photos.headerText === 404? <Navigate to={`/error=404$Gallery ${galleryId} Not Found`}/>
          : photos.isLoaded? photos.success? <Sliders imgs={photos.photos} link={'/photo/'} />  : <GalleryEmpty />
            : <Loading />
        }
      </div>
    )
};
export default ViewGallery;