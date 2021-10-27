import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Image, Form} from 'react-bootstrap';
import React, { Component, useState } from 'react'
import ReactLoading from 'react-loading';


class AddPhoto extends Component {
  constructor(props){
    super(props)
    this.state = {
      apiUrl : this.props.apiUrl,
      show : false,
      galleryId : null,
      file : null,
      uploading : false,
    }
  }

  fileSelectHandler = (event) => {
    this.setState({file : event.target.files[0]})
  }

  galleryIdChangeHandler = (event) => {
    this.setState({galleryId : event.target.value})
  }


  
  async onFormSubmit (event) {
    event.preventDefault();
    let file = this.state.file;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("galleryId", this.state.galleryId);

    this.setState({uploading: true})

    await fetch(this.state.apiUrl+'photo/create' , {
      method: 'POST',
      body: formData
    })
    .then(() => {
      document.getElementById("add-photo-form").reset();
      return;
    }).then(
      success => console.log(success)
    ).catch(
      error => console.log(error)
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
          >
            <Modal.Header >
              <Modal.Title>New Photo</Modal.Title>
              <Button variant="danger" className="btn-close" onClick={() => this.setState({show: false})}/>
            </Modal.Header>

            <Modal.Body className="add-gallery-form">
              {this.state.uploading ? <ReactLoading type="spinningBubbles" color="#000000" height={150} width={150} className="spinning-bubbles-add-gallery"/>: null}
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
                    <Form.Control type="file" className="gallery-thum" onChange={this.fileSelectHandler} accept="image/*" required/>
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