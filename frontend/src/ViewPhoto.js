import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Image} from 'react-bootstrap';
import React, { Component, useState } from 'react'

class ViewPhoto extends Component {
  constructor(props){
    super(props)
    this.state = {
      open : props.open,
    }
  }
    
    render(){
    let imgSrc = "data:;base64,"+this.props.pic;
      return (
        <>
          <Modal
            className="view-photo-modal"
            show= {this.state.open}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header >
              {this.props.children}
            </Modal.Header>

            <Modal.Body className="img">
            <Image src={imgSrc} thumbnail />
            </Modal.Body>
            
          </Modal>
        </>
      );
    }

}
export default ViewPhoto