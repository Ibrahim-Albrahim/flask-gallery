import React, { useState, useEffect }  from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactLoading from 'react-loading';
import '../scss/ViewGallery.scss'
import { Image } from 'react-bootstrap';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleLeft, faEye } from '@fortawesome/free-solid-svg-icons'
import Footer from './components/Footer'
import { apiUrl } from '../config';

const ViewGallery = () => {
    const [photos , setPhotos] = useState({photos:[], isLoaded : false});
    let { galleryId } = useParams();
    const settings = {
      className:'slider',
      dots: true,
      infinite: false,
      speed: 500,
      // slidesToShow: 3,
      autoplay: false,
      focusOnSelect: true,
      pauseOnFocus: true,
      pauseOnHover: true,
      rows: 1,
      swipeToSlide: true,
      variableWidth: true,
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetch(apiUrl+`${galleryId}`)
                .then(response => response.json())
                .then(json => setPhotos({photos: json , isLoaded : true}) );
        };
    
        fetchData();
      },[galleryId]);

    return <div className='view-gallery-container'>
                  <Link to='/'><FontAwesomeIcon className='faArrowAltCircleLeft' icon={faArrowAltCircleLeft} /></Link>
                {photos.isLoaded? <div className='header'>
                  <h1>{galleryId} | {photos.photos[0].gallery_title}</h1>
                  </div>
                : <ReactLoading type="spinningBubbles" color="#ffffff" height={300} width={300} className="spinning-bubbles"/>}

                <Slider {...settings}>
                  {photos.photos.map(photo => (
                    <Link key={photo.id} to={'/photo/'+photo.id} ><div className='view-gallery-photo'>
                      <Image src={"data:;base64,"+photo.small_size}/>
                      <div className="gallery-info">
                        <FontAwesomeIcon className='faEye' icon={faEye} />
                        <h3> ID: {photo.id} </h3>
                      </div>
                    </div></Link>
                  ))}
              </Slider>
              <Footer />
           </div>;
};
export default ViewGallery;