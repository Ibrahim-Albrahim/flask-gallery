import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Image, Form} from 'react-bootstrap';
import React, { Component, useState } from 'react'

class AddPhoto extends Component {
  constructor(props){
    super(props)
    this.state = {
      apiUrl : this.props.apiUrl,
      open : props.open,
      galleryId : null,
      file : null,
    }

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.fileSelectHandler = this.fileSelectHandler.bind(this);
    this.galleryIdChangeHandler = this.galleryIdChangeHandler.bind(this);
  }

  fileSelectHandler = (event) => {
    this.setState({file : event.target.files[0]})
  }

  galleryIdChangeHandler = (event) => {
    this.setState({galleryId : event.target.value})
  }


  
  onFormSubmit = (event) => {
    event.preventDefault();
    let file = this.state.file;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("galleryId", this.state.galleryId);



    fetch(this.state.apiUrl+'photo/create/json' , {
      method: 'POST',
      body: formData
    })
    .then(() => {
      document.getElementById("add-photo-form").reset();
      return;
    }).then(
      success => console.log(success) // Handle the success response object
    ).catch(
      error => console.log(error) // Handle the error response object
    )
  };

    
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
              <Modal.Title>New Photo</Modal.Title>
              {this.props.children}
            </Modal.Header>

            <Modal.Body className="add-gallery-form">
              <Form onSubmit={this.onFormSubmit} id="add-photo-form"  enctype="multipart/form-data">
                <Form.Group controlId="formFile" className="mb-3">
                  <div className="title-div" >
                    <Form.Label>Gallery Id:</Form.Label>
                    <Form.Control className="gallery-title" type="number" placeholder="0" onChange={this.galleryIdChangeHandler} required />
                  </div>
                  <div className="file-div">
                    <Form.Label>photo:</Form.Label>
                    <Form.Control type="file" className="gallery-thum" onChange={this.fileSelectHandler} required/>
                  </div>
                  <Button variant="primary" type="submit">Add</Button>
                </Form.Group>
              </Form>
            </Modal.Body>
            

          </Modal>
        </>
      );
    }

}
export default AddPhoto