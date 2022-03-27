import React from 'react';
import Slider from "react-slick";
import { Image } from 'react-bootstrap';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import '../scss/Sliders.scss';

const Sliders = (props) => {
    const settings = {
        className:'slider',
        dots: true,
        infinite: false,
        speed: 500,
        autoplay: false,
        focusOnSelect: true,
        rows: 1,
        swipeToSlide: true,
        variableWidth: true,
    };
    
    return  (    
        <Slider {...settings}>
            {props.imgs.map(img => (
            <Link key={img.id} to={props.link+img.id} >
                <div className='view-photo'>
                    <Image src={"data:;base64,"+img.small_size }/>
                    <div className="info">
                        <FontAwesomeIcon className='fa-eye' icon={faEye} />
                        <h3> {img.id} {props.splitter} {img.title} </h3>
                    </div>
                </div>
            </Link>
            ))}
        </Slider>
    )
};
export default Sliders;