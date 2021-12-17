import React, {Component} from 'react';
import ReactLoading from 'react-loading';
import '../scss/Home.scss';
import { Image } from 'react-bootstrap';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import Footer from './components/Footer'

class Home extends Component {

  constructor(props){
    super(props);
    this.state = {
      // apiUrl: 'http://192.168.43.41:5000/',
      apiUrl: 'http://localhost:5000/',
      galleries: [],
      isLoaded: false,
    }
  }

  getData () {
    fetch(this.state.apiUrl)
    .then(response => response.json())
    .then(json => {
      this.setState({
        isLoaded: true,
        galleries: json,
      })
    });
  }

  makeIsLoadedFalse () {
    this.setState({
      isLoaded: false,
    })
  }

  render(){
    var {isLoaded , galleries} = this.state;
    if (!isLoaded) { this.getData()} 
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
    
    return (

      !isLoaded ? <ReactLoading type="spinningBubbles" color="#ffffff" height={300} width={300} className="spinning-bubbles"/>
      : <div className="home-container">
            <Slider {...settings}>
              {galleries.map(gallery => (
                <a href={'/gallery/'+gallery.id} ><div className='view-gallery-photo'>
                  <Image src={"data:;base64,"+gallery.img}/>
                  <div className="gallery-info">
                  <FontAwesomeIcon className='faEye' icon={faEye} />
                    <h3> {gallery.id} | {gallery.title} </h3>
                  </div>
                </div></a>
              ))}
            </Slider>
            <Footer />
        </div>
      

    );
  }
}

export default Home;
