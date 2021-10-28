import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Modal, Image} from 'react-bootstrap';
import React, {Component} from 'react';
import './css/viewphoto.css';

class ViewPhoto extends Component {
  constructor(props){
    super(props)
    this.state = {
      show : false,
      isLoaded : false,
    }
  }
    
    render(){
    let imgSrc = "data:;base64,"+this.props.pic;
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
            <Modal.Body className="img">
            <Image src={imgSrc} thumbnail />
            </Modal.Body>            
          </Modal>
        </>
      );
    }

}
export default ViewPhoto