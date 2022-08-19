import React, { useState, useEffect } from 'react';
import '../scss/Home.scss';
import { apiUrl } from '../config';
import Header from '../components/Header';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons'
import Sliders from '../components/Sliders';


const Home = () => {
  const [galleries , setGalleries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        await fetch(apiUrl)
            .then(response => response.json())
            .then(json => setGalleries(json) );
    };
    fetchData();
  },[]);

  return (
    <div className="home-container">
      <Header headerText='hemo7f12 Gallery' headerLink='' icon={faArrowAltCircleLeft} clsName='faArrowAltCircleLeft'/>
        <Sliders ides={galleries} link={'/gallery/'} splitter=' | '/>
    </div>
  );
};
export default Home;