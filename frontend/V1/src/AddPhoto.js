import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Image, Form} from 'react-bootstrap';
import React, { Component, useState } from 'react'
import ReactLoading from 'react-loading';
import './css/addphoto.css';



class AddPhoto extends Component {
  constructor(props){
    super(props)
    this.state = {
      apiUrl : this.props.apiUrl,
      show : false,
      galleryId : null,
      file : {},
      uploading : false,
      formData : new FormData(),
      password : ''

    }
  }

  
  fileSelectHandler = (event) => {
    var totalfiles = event.target.files.length;
    for (var index=0; index < totalfiles; index++){
      this.state.formData.append("file", event.target.files[index]);
    }
  }

  galleryIdChangeHandler = (event) => {
    this.setState({galleryId : event.target.value})
  }

  passwordChangeHandler = (event) => {
    this.setState({password : event.target.value})
  }


  
  async onFormSubmit (event) {
    event.preventDefault();
    // const formData = new FormData();
    // this.state.formData.append("file", this.state.file);
    this.state.formData.append("galleryId", this.state.galleryId);
    this.state.formData.append("password", this.state.password)

    this.setState({uploading: true})

    await fetch(this.state.apiUrl+'photo/create' , {
      method: 'POST',
      body: this.state.formData
    })
    .then(() => {
      document.getElementById("add-photo-form").reset();
      return;
    }).then(
      success => console.log('success')
    ).catch(
      error => console.log('error')
    )

    await this.props.makeIsLoadedFalse();
    this.setState({uploading: false})
    this.setState({show: false})
  };

    
    render(){
      return (
        <>
          <a className="btn cold" onClick={() => this.setState({show: true})}> Add Photo </a>
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
              <Modal.Title>New Photo</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              {this.state.uploading ? <ReactLoading type="spinningBubbles" color="#000000" height={150} width={150} className="spinning-bubbles"/>: null}
              <Form
              onSubmit={this.onFormSubmit.bind(this)}
              id="add-photo-form"
              encType="multipart/form-data"
              >
                <Form.Group controlId="formFile" className="mb-3">
                  <div className="title-div" >
                    <Form.Label>Gallery Id:</Form.Label>
                    <Form.Control className="gallery-id" type="number" placeholder="0" onChange={this.galleryIdChangeHandler} required />
                  </div>
                  <div className="file-div">
                    <Form.Label>photo:</Form.Label>
                    <Form.Control type="file" className="gallery-thum" onChange={this.fileSelectHandler} accept="image/*" required multiple/>
                  </div>
                  <div className="file-div mt-2">
                    <Form.Label>password:</Form.Label>
                    <Form.Control type="password" className="gallery-thum" onChange={this.passwordChangeHandler} required />
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