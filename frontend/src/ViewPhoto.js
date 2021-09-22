import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Image} from 'react-bootstrap';
import React, { Component, useState } from 'react'
import Photo from './Photo';


const apiUrl = 'http://localhost:5000/'


function goToGallery (){
  window.location.href='http://hemo7f12.ahhsn.com/gallery/public'
}


class ViewPhoto extends Component {
  constructor(props){
    super(props)
    this.state = {
      open : props.open,
    }
  }

  componentDidMount(){
  }
    
    render(){
    let imgSrc = "data:;base64,"+this.props.pic;
      return (
        <>
          <Modal
            size="lg"
            show= {this.state.open}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header >
              <Modal.Title>{this.props.title}</Modal.Title>
              {this.props.children}
            </Modal.Header>

            <Modal.Body >
            <Image src={imgSrc} thumbnail />
            </Modal.Body>
            
            <Modal.Footer>

            </Modal.Footer>
          </Modal>
        </>
      );
    }

}
export default ViewPhoto