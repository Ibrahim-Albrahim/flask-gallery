import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Image} from 'react-bootstrap';
import React, { Component, useState } from 'react'

function goToGallery (){
  window.location.href='http://hemo7f12.ahhsn.com/gallery/public'
}


class ShowMoadl extends Component {
  constructor(props){
    super(props)
    this.state = {
      open : props.open,
      setShow : null,
      show : null
    }
  }

  componentDidMount(){
  }
    
    render(){
    
    
      const handleClose = () => this.setState({open : false})
      const handleOpen = () => this.setState({open : this.props.open})

      

      return (
        <>
          <Modal
            show= {this.state.open}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body >
            <Image className="" src={this.props.pic} thumbnail />
            </Modal.Body>
            
            <Modal.Footer>
              <Button variant="primary" onClick={goToGallery}>Go to Gallery</Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    }

}
export default ShowMoadl