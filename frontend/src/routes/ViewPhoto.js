import React, { useState, useEffect }  from 'react';
import { useParams } from 'react-router-dom';
import {Image} from 'react-bootstrap';
import '../scss/ViewPhoto.scss'
import RcViewer from '@hanyk/rc-viewer'
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons'
import { apiUrl } from '../config';
import Loading from './components/Loading'
import Header from './components/Header';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const ViewGallery = () => {
  const [photo , setPhoto] = useState({photo:[] , isLoaded: false , galleryId: '' , galleryName: '' , photoId: ''});
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
              .then(json => setPhoto({photo: json , isLoaded: true , galleryId: json.gallery_id , galleryName: json.gallery_title , photoId: json.id}) );
      };
      fetchData();
  },[photoId]);

  return (
    <div className='view-photo-container'>
      <Header headerText={photo.galleryId +' | '+photo.galleryName +' / '+ photo.photoId} headerLink={'/gallery/'+photo.galleryId} icon={faArrowAltCircleLeft}/>
      {photo.isLoaded? 
      <div className='view-photo-details'>
        <section>
          <RcViewer className='rc-viewer' options={options}>
            <Image src={"data:;base64,"+photo.photo.full_size}/>
            <FontAwesomeIcon className='fa-eye' icon={faEye} />
          </RcViewer>
        </section>
        <section>
          <ul>
            <li><pre>FileName:    {photo.photo.FileName}</pre></li>
            <li><pre>Size:        {photo.photo.Size}</pre></li>
            <li><pre>DateTime:    {photo.photo.DateTime}</pre></li>
            <li><pre>Make:        {photo.photo.Make}</pre></li>
            <li><pre>Model:       {photo.photo.Model}</pre></li>
            <li><pre>Software:    {photo.photo.Software}</pre></li>
            <li><pre>FNumber:     {photo.photo.FNumber}</pre></li>
            <li><pre>FocalLength: {photo.photo.FocalLengthIn35mmFilm}</pre></li>
            <li><pre>ISO:         {photo.photo.ISO}</pre></li>
            <li><pre>Shutter:     {photo.photo.ShutterSpeedValue}</pre></li>
            <li><pre>Aperture:    {photo.photo.ApertureValue}</pre></li>
          </ul>
        </section>
      </div>
      : <Loading />} 
  </div>
  );
};
export default ViewGallery;