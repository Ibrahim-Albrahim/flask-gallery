import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Image} from 'react-bootstrap';
import React, { Component, useState } from 'react'
import Photo from './Photo';


class ShowModal extends Component {
  constructor(props){
    super(props)
    this.state = {
      apiUrl : this.props.apiUrl,
      open : props.open,
      galleryId : props.galleryId,
      photos : [],
    }
  }

  componentDidMount(){
    var {galleryId} = this.state;
    fetch(this.props.apiUrl+`${galleryId}/json`)
      .then(response => response.json())
      .then(json => {
        this.setState({
          isLoaded: true,
          photos: json,
        })
      });
  }
    
    render(){
      var {isLoaded , photos} = this.state;
      // console.log(isLoaded,photos)
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
              {photos.map(photo => (
                <Photo apiUrl={this.state.apiUrl} key={photo.id} id={photo.id} pic= {photo.img}/>
              ))}
            </Modal.Body>

          </Modal>
        </>
      );
    }

}
export default ShowModal