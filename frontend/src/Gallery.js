import React, {Component} from 'react';
import { Button, Container, Row, Col, Image, Nav, Modal} from 'react-bootstrap';
import ShowModal from './ShowModal';

class Gallery extends Component {
  constructor(props){

    super(props)
    this.state = {
      apiUrl : this.props.apiUrl,
      modalPic : null,
      showModal : false
    }

    this.clickDelete = this.clickDelete.bind(this);
  }

  
  clickDelete = () => {
    fetch(this.state.apiUrl+'gallery/'+ this.props.id +'/delete' , {method: 'GET'})
    this.props.makeIsLoadedFalse();
  }

  render(){

    let imgSrc = "data:;base64,"+this.props.pic;
    
    return (
      
      <Col className="gallery-container" id={this.props.id}>
        <Image className="gallery-img" src={imgSrc} thumbnail />

        <div className="gallery-info" id="gallerybtns">
          <h3> {this.props.id} | {this.props.title} </h3>
          <ShowModal apiUrl={this.state.apiUrl} galleryId={this.props.id} title={this.props.title}/>
          <Button href="#" variant="success">Edit</Button>
          {/* TODO show modal to confirm delete */}
          <Button variant="danger" className="danger" onClick={this.clickDelete}>Delete</Button>
        </div>

      </Col>

    );
  }
}

export default Gallery;
