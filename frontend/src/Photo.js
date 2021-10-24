import React, {Component} from 'react';
import { Button, Container, Row, Col, Image, Nav, Modal} from 'react-bootstrap';
import ViewPhoto from './ViewPhoto';

class Photo extends Component {
  constructor(props){

    super(props)
    this.state = {
      modalPic : null,
      showModal : false,
      apiUrl : this.props.apiUrl
    }

    this.clickDelete = this.clickDelete.bind(this);
  }

  
  async clickDelete () {
    await fetch(this.state.apiUrl+'photo/'+ this.props.id +'/delete' , {method: 'GET'})
    await this.props.makeIsLoadedFalse();
  }
  


  render(){

    let imgSrc = "data:;base64,"+this.props.smallSize;
    
    return (
      
      <Col className="gallery-container" id={this.props.id}>
        <Image className="gallery-img" src={imgSrc} thumbnail />

        <div className="gallery-info" id="gallerybtns">
          <h3> {this.props.title} </h3>
          <Button variant="primary" onClick={() => this.setState({showModal: true})}>View</Button>
          <Button href="#" variant="success">Edit</Button>
          {/* TODO show modal to confirm delete */}
          <Button variant="danger" className="danger" onClick={this.clickDelete}>Delete</Button>
        </div>

        {this.state.showModal && 
        <ViewPhoto open pic={this.props.fullSize} >
          <Button variant="danger" className="btn-close" onClick={() => this.setState({showModal: false})}/>
        </ViewPhoto>
        }
      </Col>

    );
  }
}

export default Photo;
