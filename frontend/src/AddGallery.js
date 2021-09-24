import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Image, Form} from 'react-bootstrap';
import React, { Component, useState } from 'react'

const apiUrl = 'http://localhost:5000/'


class AddGallery extends Component {
  constructor(props){
    super(props)
    this.state = {
      open : props.open,
      title : '',
      file : null,
    }

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.fileSelectHandler = this.fileSelectHandler.bind(this);
    this.titleChangeHandler = this.titleChangeHandler.bind(this);
    

  }

    fileSelectHandler = (event) => {
      this.setState({file : event.target.files[0]})
    }

    titleChangeHandler = (event) => {
      this.setState({title : event.target.value})
    }


    
    onFormSubmit = (event) => {
      event.preventDefault();
      let file = this.state.file;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", this.state.title);



      fetch(apiUrl+'gallery/create/json' , {
        method: 'POST',
        body: formData
      })
      .then(() => {
        document.getElementById("add-gallery-form").reset();
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
              <Modal.Title>New Gallery</Modal.Title>
              {this.props.children}
            </Modal.Header>

            <Modal.Body className="add-gallery-form">

              <Form onSubmit={this.onFormSubmit} id="add-gallery-form"  enctype="multipart/form-data">
                <Form.Group controlId="formFile" className="mb-3">
                  <div className="title-div" >
                    <Form.Label>Gallery title:</Form.Label>
                    <Form.Control className="gallery-title" type="text" placeholder="title" onChange={this.titleChangeHandler} required />
                  </div>
                  <div className="file-div">
                    <Form.Label>Gallery photo:</Form.Label>
                    <Form.Control type="file" className="gallery-thum" onChange={this.fileSelectHandler} name="inputFile" required/>
                  </div>
                  <Button variant="primary" type="submit">Add</Button>
                </Form.Group>
              </Form>
              
            </Modal.Body>
            
            <Modal.Footer className="footer">
              
            </Modal.Footer>
          </Modal>
        </>
      );
    }

}
export default AddGallery