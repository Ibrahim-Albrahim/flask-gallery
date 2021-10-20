import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Image, Form} from 'react-bootstrap';
import React, { Component, useState } from 'react'

class AddGallery extends Component {
  constructor(props){
    super(props)
    this.state = {
      apiUrl : this.props.apiUrl,
      show : false,
      title : '',
      file : null,
    }

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

      this.props.makeIsLoadedFalse();
      this.setState({show: false})



      fetch(this.state.apiUrl+'gallery/create' , {
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
          <a className="btn cold" onClick={() => this.setState({show: true})}> Add Gallery </a>
          <Modal
            className="add-gallery-modal"
            show= {this.state.show}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header >
              <Modal.Title>New Gallery</Modal.Title>
              <Button variant="danger" className="btn-close" onClick={() => this.setState({show: false})}/>
            </Modal.Header>

            <Modal.Body className="add-gallery-form">

              <Form 
              onSubmit={this.onFormSubmit}
              id="add-gallery-form"
              encType="multipart/form-data"
              >
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
            

          </Modal>
        </>
      );
    }

}
export default AddGallery