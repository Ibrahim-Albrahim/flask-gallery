import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Image, Form} from 'react-bootstrap';
import React, { Component, useState } from 'react'

const apiUrl = 'http://localhost:5000/'


class AddGallery extends Component {
  constructor(props){
    super(props)
    this.state = {
      open : props.open,
    }
  }
    
    render(){
      return (
        <>
          <Modal
            className="add-gallery-modal"
            show= {this.state.open}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header >
              <Modal.Title>New Gallery</Modal.Title>
              {this.props.children}
            </Modal.Header>

            <Modal.Body className="add-gallery-form">
              <Form.Group controlId="formFile" className="mb-3">
                <div className="title-div" >
                  <Form.Label>Gallery title:</Form.Label>
                  <Form.Control className="gallery-title" type="number" placeholder="0" required />
                </div>
                <div className="file-div">
                  <Form.Label>Gallery photo:</Form.Label>
                  <Form.Control type="file" className="gallery-thum"/>
                </div>
              </Form.Group>
            </Modal.Body>
            
            <Modal.Footer className="footer">
              <Button variant="primary" type="submit">Add</Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    }

}
export default AddGallery