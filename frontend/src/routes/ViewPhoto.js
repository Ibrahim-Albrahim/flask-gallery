import React, { useState, useEffect }  from 'react';
import { useParams , Navigate } from 'react-router-dom';
import {Image} from 'react-bootstrap';
import '../scss/ViewPhoto.scss'
import RcViewer from '@hanyk/rc-viewer'
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons'
import { apiUrl } from '../config';
import Loading from '../components/Loading'
import Header from '../components/Header';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const ViewPhoto = () => {
  const [photos , setPhotos] = useState({photos:[] , isLoaded: false , galleryId: '' , galleryName: '' , photoId: ''});
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
          await fetch(apiUrl+`/photo/${photoId}`)
              .then(response => response.json())
              .then(json => setPhotos({photos: json , isLoaded: true , galleryId: json[0].gallery_id , galleryName: json[0].gallery_title , photoId: json[0].id}) );
      };
      fetchData();
  },[photoId]);

  var photo = photos.photos[0]

  return (
    <div className='view-photo-container'>
      <Header headerText={photos.galleryId +' | '+photos.galleryName +' / '+ photos.photoId} headerLink={'/gallery/'+photos.galleryId} icon={faArrowAltCircleLeft}/>
      {
      photos.photoId === '404'? <Navigate to={`/error=404$Photo ${photoId} Not Found`}/>
        :photos.isLoaded? 
          <div className='view-photo-details'>
            <section className='image-section'>
              <RcViewer className='rc-viewer' options={options}>
                <Image src={"data:;base64,"+photo.full_size}/>
                <FontAwesomeIcon className='fa-eye' icon={faEye} />
              </RcViewer>
            </section>
            <section className='details-section'>
              <ul>
                <li><pre>FileName:    {photo.FileName}</pre></li>
                <li><pre>Size:        {photo.Size}</pre></li>
                <li><pre>DateTime:    {photo.DateTime}</pre></li>
                <li><pre>Make:        {photo.Make}</pre></li>
                <li><pre>Model:       {photo.Model}</pre></li>
                <li><pre>Software:    {photo.Software}</pre></li>
                <li><pre>Shutter:     {photo.ShutterSpeedValue}</pre></li>
                <li><pre>Aperture:    {photo.ApertureValue}</pre></li>
                <li><pre>ISO:         {photo.ISO}</pre></li>
                <li><pre>FNumber:     {photo.FNumber}</pre></li>
                <li><pre>FocalLength: {photo.FocalLengthIn35mmFilm}</pre></li>
              </ul>
            </section>
          </div>
          : <Loading />
      }
  </div>
  );
};
export default ViewPhoto;