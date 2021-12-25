import React, { useState, useEffect } from 'react';
import ReactLoading from 'react-loading';
import '../scss/Home.scss';
import { Image } from 'react-bootstrap';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import Footer from './components/Footer';
import { apiUrl } from '../config';
import { Link } from 'react-router-dom';

const Home = () => {
  const [galleries , setGalleries] = useState({galleries:[], isLoaded : false});
  const settings = {
    className:'slider',
    dots: true,
    infinite: false,
    speed: 500,
    // slidesToShow: 1,
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
        await fetch(apiUrl)
            .then(response => response.json())
            .then(json => setGalleries({galleries: json , isLoaded : true}) );
    };

    fetchData();
  },[]);
   
  return (

    galleries.isLoaded ? <div className="home-container">
          <Slider {...settings}>
            {galleries.galleries.map(gallery => (
              <Link to={'gallery/'+gallery.id} >
                <div className='view-gallery-photo'>
                <Image src={"data:;base64,"+gallery.img}/>
                <div className="gallery-info">
                <FontAwesomeIcon className='faEye' icon={faEye} />
                  <h3> {gallery.id} | {gallery.title} </h3>
                </div>
              </div></Link>
            ))}
          </Slider>
          <Footer />
      </div>
    : <ReactLoading type="spinningBubbles" color="#ffffff" height={300} width={300} className="spinning-bubbles"/>
    
  );
}


export default Home;
