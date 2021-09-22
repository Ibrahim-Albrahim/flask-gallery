import React, {Component} from 'react';
import { Button, Container, Row, Col, Image, Nav, Modal} from 'react-bootstrap';
import ShowMoadl from './ShowMoadl';


class Gallery extends Component {
  constructor(props){

    super(props)
    this.state = {
      modalPic : null,
      showModal : false
    }

    this.clickDelete = this.clickDelete.bind(this);
  }

  
  clickDelete (id){}


  



  render(){

    let imgSrc = "data:;base64,"+this.props.pic;
    
    return (
      
      <Col className="gallery-container bg-dark" id={this.props.id}>
        <Image className="gallery-img" src={imgSrc} thumbnail />

        <div className="gallery-info" id="gallerybtns">
          <h3> {this.props.title} </h3>
          <Button variant="primary" onClick={() => this.setState({showModal: true})}>View</Button>
          <Button href="#" variant="success">Edit</Button>
          <Button variant="danger" className="danger" onClick={this.clickDelete()}>Delete</Button>
        </div>

        {this.state.showModal && <ShowMoadl open pic={imgSrc} title={this.props.title} />}



      </Col>

    );
  }
}

export default Gallery;
