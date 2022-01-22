import React, { useState, useEffect }  from 'react';
import { useParams, Link } from 'react-router-dom';
import {Image} from 'react-bootstrap';
import ReactLoading from 'react-loading';
import '../scss/ViewPhoto.scss'
import RcViewer from '@hanyk/rc-viewer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons'
import { apiUrl } from '../config';

const ViewGallery = () => {
  const [photos , setPhotos] = useState({photos:[],isLoaded: false});
  let { photoId } = useParams();


  const options={
    button: false,
    navbar: false,
    title: false,
    toolbar: {
      zoomIn: 1,
      zoomOut: 2,
      rotateLeft: 3,
      rotateRight: 4,
      flipHorizontal: 5,
      flipVertical: 6,
    },
    loop: false,
    show: true,
    container: 'Modal'
  }

  useEffect(() => {
      const fetchData = async () => {
          await fetch(apiUrl+`photo/${photoId}`)
              .then(response => response.json())
              .then(json => setPhotos({photos: json,isLoaded: true}) );
      };
  
      fetchData();
    },[photoId]);

  const page = 
  <div className='view-photo-container'>
    <h5>Click Photo to View</h5>
    {photos.isLoaded? 
    <div className='view-photo-details'>
      <Link to={'/gallery/'+photos.photos.gallery_id}><FontAwesomeIcon className='faArrowAltCircleLeft' icon={faArrowAltCircleLeft} /></Link>
      <RcViewer options={options}> <Image src={"data:;base64,"+photos.photos.full_size}/> </RcViewer>
      <ul>
        <li><pre><span>ID:         {photos.photos.id}</span></pre></li>
        <li><pre><span>FileName:   {photos.photos.FileName}</span></pre></li>
        <li><pre><span>Size:       {photos.photos.Size}</span></pre></li>
        <li><pre><span>DateTime:   {photos.photos.DateTime}</span></pre></li>
        <li><pre><span>Make:       {photos.photos.Make}</span></pre></li>
        <li><pre><span>Model:      {photos.photos.Model}</span></pre></li>
        <li><pre><span>Software:   {photos.photos.Software}</span></pre></li>
        <li><pre><span>FNumber:    {photos.photos.FNumber}</span></pre></li>
        <li><pre><span>FocalLength:{photos.photos.FocalLengthIn35mmFilm}</span></pre></li>
        <li><pre><span>ISO:        {photos.photos.ISO}</span></pre></li>
        <li><pre><span>Shutter:    {photos.photos.ShutterSpeedValue}</span></pre></li>
        <li><pre><span>Aperture:   {photos.photos.ApertureValue}</span></pre></li>
      </ul>
    </div>
    : <ReactLoading type="spinningBubbles" color="#ffffff" height={300} width={300} className="spinning-bubbles"/>} 
  </div>;
  return page;
};
export default ViewGallery;