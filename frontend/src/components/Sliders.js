import React, {useEffect, useState} from 'react';
import Slider from "react-slick";
import { Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { apiUrl } from '../config';
import { Link } from 'react-router-dom';
import Loading from './Loading';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../scss/Sliders.scss';


const Sliders = (props) => {
    const [imgs , setImgs] = useState([]);
    const singleImg = (i) => imgs[i]? (
        <Link to={props.link+imgs[i][0].id} >
            <div className='view-photo'>
                <Image src={"data:;base64,"+imgs[i][0].small_size }/>
                <div className="info">
                    <FontAwesomeIcon className='fa-eye' icon={faEye} />
                    <h3> {imgs[i][0].id} {props.splitter} {imgs[i][0]? imgs[i][0].title : null} </h3>
                </div>
            </div>
        </Link>
    ): <Loading className='loadingg' /> ;

    const images = ()=> {
        let data = []
        for (let i = 0; i < props.ides.length; i++) { data.push(singleImg(i)) }
        return data
    };
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

    useEffect(() => {
        const fetchData = async () => {
            props.ides.map(async (id) => {
                await fetch(apiUrl+props.link+id)
                    .then(response => response.json())
                    .then(json => setImgs(i => [...i, json]))
            }); 
        };
        fetchData();
    },[props.ides, props.link]);
    return (    
        <Slider {...settings}>
            {images()}
        </Slider>
    )
};
export default Sliders;