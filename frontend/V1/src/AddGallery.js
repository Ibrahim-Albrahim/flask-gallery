import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Image, Form} from 'react-bootstrap';
import React, { Component, useState } from 'react'
import ReactLoading from 'react-loading';
import './css/addgallery.css';



class AddGallery extends Component {
  constructor(props){
    super(props)
    this.state = {
      apiUrl : this.props.apiUrl,
      show : false,
      title : '',
      file : null,
      uploading : false,
    }

  }

    fileSelectHandler = (event) => {
      this.setState({file : event.target.files[0]})
    }

    titleChangeHandler = (event) => {
      this.setState({title : event.target.value})
    }


    
    async onFormSubmit (event) {
      event.preventDefault();
      let file = this.state.file;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", this.state.title);

      this.setState({uploading: true})

      await fetch(this.state.apiUrl+'gallery/create' , {
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
      
      await this.props.makeIsLoadedFalse();
      this.setState({uploading: false})
      this.setState({show: false})
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
            aria-labelledby="contained-modal-title-vcenter"
            size="sm"
            onHide={() => this.setState({show:false})}
          >
            <Modal.Header closeButton>
              <Modal.Title>New Gallery</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              {this.state.uploading ? <ReactLoading type="spinningBubbles" color="#000000" height={150} width={150} className="spinning-bubbles"/>
              : null}
              <Form 
              onSubmit={this.onFormSubmit.bind(this)}
              id="add-gallery-form"
              encType="multipart/form-data"
              >
                <Form.Group controlId="formFile" className="mb-3">
                  <div className="title-div" >
                    <Form.Label className="gallery-labels">Gallery title:</Form.Label>
                    <Form.Control className="gallery-title" type="text" placeholder="title" onChange={this.titleChangeHandler} required />
                  </div>
                  <div className="file-div">
                    <Form.Label className="gallery-labels">Gallery photo:</Form.Label>
                    <Form.Control type="file" className="gallery-thum" onChange={this.fileSelectHandler} name="inputFile" accept="image/*" required/>
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