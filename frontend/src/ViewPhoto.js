import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Modal, Image} from 'react-bootstrap';
import React, {Component} from 'react';
import ReactLoading from 'react-loading';
import './css/viewphoto.css';

class ViewPhoto extends Component {
  constructor(props){
    super(props)
    this.state = {
      show : false,
      isLoaded : false,
      apiUrl : this.props.apiUrl,
      photoId : this.props.photoId,
      photo : [],
    }
  }
    
  getData () {
    var {photoId} = this.state;
    fetch(this.state.apiUrl+`photo/${photoId}`)
    .then(response => response.json())
    .then(json => {
      this.setState({
        isLoaded: true,
        photo: json,
      })
    })}

  render(){
    var {show,isLoaded,photo} = this.state;
    let imgSrc = "data:;base64,"+photo.full_size;
    
    !isLoaded & show ? this.getData() :null
    console.log(this.state.photo)
    return (
      <>
        
        <Button variant="primary" onClick={() => this.setState({show: true})}>View</Button>
        <Modal
          className= "view-photo-modal"
          show= {this.state.show}
          backdrop="static"
          keyboard={false}
          aria-labelledby="contained-modal-title-vcenter"
          // fullscreen={true}
          size="lg"
          onHide={() => this.setState({show:false})}
        >
          <Modal.Header closeButton/>
          <Modal.Body className="img-body">
          {!isLoaded ? <ReactLoading type="spinningBubbles" color="#ffffff" height={300} width={300}/>
                :<Image className="img" src={imgSrc} thumbnail />}
          <ul>
            <li><pre><span>ID:         {photo.id}</span></pre></li>
            <li><pre><span>FileName:   {photo.FileName}</span></pre></li>
            <li><pre><span>Size:       {photo.Size}</span></pre></li>
            <li><pre><span>DateTime:   {photo.DateTime}</span></pre></li>
            <li><pre><span>Make:       {photo.Make}</span></pre></li>
            <li><pre><span>Model:      {photo.Model}</span></pre></li>
            <li><pre><span>Software:   {photo.Software}</span></pre></li>
            <li><pre><span>FNumber:    {photo.FNumber}</span></pre></li>
            <li><pre><span>FocalLength:{photo.FocalLengthIn35mmFilm}</span></pre></li>
            <li><pre><span>ISO:        {photo.ISO}</span></pre></li>
            <li><pre><span>Shutter:    {photo.ShutterSpeedValue}</span></pre></li>
            <li><pre><span>Aperture:   {photo.ApertureValue}</span></pre></li>
          </ul>
          </Modal.Body>            
        </Modal>
      </>
    );
    }

}
export default ViewPhoto