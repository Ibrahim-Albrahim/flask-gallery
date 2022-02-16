import React, { useState, useEffect } from 'react';
import '../scss/Home.scss';
import { apiUrl } from '../config';
import Loading from './components/Loading'
import Sliders from './components/Sliders';
import Header from './components/Header';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons'


const Home = () => {
  const [galleries , setGalleries] = useState({galleries:[], isLoaded : false});

  useEffect(() => {
    const fetchData = async () => {
        await fetch(apiUrl)
            .then(response => response.json())
            .then(json => setGalleries({galleries: json , isLoaded : true}) );
    };
    fetchData();
  },[]);

  return (
    <div className="home-container">
      <Header headerText='hemo7f12 Gallery' headerLink='' icon={faArrowAltCircleLeft} clsName='faArrowAltCircleLeft'/>
      {galleries.isLoaded ? <Sliders imgs={galleries.galleries} link={'/gallery/'} splitter=' | ' /> : <Loading />}
    </div>
    
  );
}
export default Home;
