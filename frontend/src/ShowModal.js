import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Image} from 'react-bootstrap';
import React, { Component, useState } from 'react'
import Photo from './Photo';


const apiUrl = 'http://localhost:5000/'


function goToGallery (){
  window.location.href='http://hemo7f12.ahhsn.com/gallery/public'
}


class ShowModal extends Component {
  constructor(props){
    super(props)
    this.state = {
      open : props.open,
      galleryId : props.galleryId,
      photos : [],
    }
  }

  componentDidMount(){
    var {galleryId} = this.state;
    fetch(apiUrl+`${galleryId}/json`)
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

      //TODO: progress indicator.
      //TODO: arrows to move between pics.


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
                <Photo key={photo.id} id={photo.id} pic= {photo.img}/>
              ))}
            </Modal.Body>
            
            <Modal.Footer>

            </Modal.Footer>
          </Modal>
        </>
      );
    }

}
export default ShowModal