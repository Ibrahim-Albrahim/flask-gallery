import React, {Component} from 'react';
import {Button,Col, Image} from 'react-bootstrap';
import '../../scss/Gallery.scss';


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

  
  async clickDelete () {
    await fetch(this.state.apiUrl+'gallery/'+ this.props.id +'/delete' , {method: 'GET'})
    await this.props.makeIsLoadedFalse();
  }

  render(){

    let imgSrc = "data:;base64,"+this.props.pic;
    
    return (
      
      <Col className="gallery-container" id={this.props.id}>
        <Image className="gallery-img" src={imgSrc} thumbnail />

        <div className="gallery-info" id="gallerybtns">
          <h3> {this.props.id} | {this.props.title} </h3>
          {/* <ShowModal apiUrl={this.state.apiUrl} galleryId={this.props.id} title={this.props.title}/> */}
          <Button href="#" variant="success">Edit</Button>
          <Button variant="danger" className="danger" onClick={this.clickDelete}>Delete</Button>
        </div>

      </Col>

    );
  }
}

export default Gallery;
