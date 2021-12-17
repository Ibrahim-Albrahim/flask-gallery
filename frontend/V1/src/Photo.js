import React, {Component} from 'react';
import {Button,Col, Image} from 'react-bootstrap';
import ViewPhoto from './ViewPhoto';
import './css/photo.css';

class Photo extends Component {
  constructor(props){
    super(props)
    this.state = {
      modalPic : null,
      showModal : false,
      apiUrl : this.props.apiUrl}}
  async clickDelete () {
    await fetch(this.state.apiUrl+'photo/'+ this.props.id +'/delete' , {method: 'GET'})
    await this.props.makeIsLoadedFalse();}
  render(){
    let imgSrc = "data:;base64,"+this.props.smallSize;
    return (
      <Col className="gallery-container" id={this.props.id}>
        <Image className="gallery-img" src={imgSrc} thumbnail />
        <div className="gallery-info" id="gallerybtns">
          <h3> ID: {this.props.id} </h3>
          <ViewPhoto pic={this.props.fullSize} apiUrl={this.state.apiUrl} photoId={this.props.id} />
          <Button href="#" variant="success">Edit</Button>
          {/* TODO show modal to confirm delete */}
          <Button variant="danger" className="danger" onClick={this.clickDelete.bind(this)}>Delete</Button>
        </div>
      </Col>
    );}}
export default Photo;
