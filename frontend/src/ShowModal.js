import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Image} from 'react-bootstrap';
import React, { Component, useState } from 'react'

function goToGallery (){
  window.location.href='http://hemo7f12.ahhsn.com/gallery/public'
}


class ShowModal extends Component {
  constructor(props){
    super(props)
    this.state = {
      open : props.open,
    }
  }

  componentDidMount(){
  }
    
    render(){
        
      return (
        <>
          <Modal
            show= {this.state.open}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header >
              <Modal.Title>{this.props.title}</Modal.Title>
              {this.props.children}
            </Modal.Header>

            <Modal.Body >
            <Image className="" src={this.props.pic} thumbnail />
            </Modal.Body>
            
            <Modal.Footer>

            </Modal.Footer>
          </Modal>
        </>
      );
    }

}
export default ShowModal