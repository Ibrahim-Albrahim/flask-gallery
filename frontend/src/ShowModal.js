import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Modal} from 'react-bootstrap';
import React, {Component} from 'react'
import Photo from './Photo';
import ReactLoading from 'react-loading';
import './css/showmodal.css';




class ShowModal extends Component {
  constructor(props){
    super(props)
    this.state = {
      apiUrl : this.props.apiUrl,
      galleryId : props.galleryId,
      photos : [],
      isLoaded : false,
      show : false
    }
  }

  getData () {
    var {galleryId} = this.state;
    fetch(this.props.apiUrl+`${galleryId}`)
      .then(response => response.json())
      .then(json => {
        this.setState({
          isLoaded: true,
          photos: json,
        })
      });
  }

  makeIsLoadedFalse () {
    this.setState({
      isLoaded: false,
    })
  }
    
    render(){
      var {isLoaded , photos, show} = this.state;

      !isLoaded & show ? this.getData() :null

      return (
        <>
          <Button variant="primary" onClick={() => this.setState({show: true})}>View</Button>
          <Modal
            show= {this.state.show}
            backdrop="static"
            fullscreen={true}
            keyboard={false}
            aria-labelledby="contained-modal-title-vcenter"
            onHide={() => this.setState({show:false})}
          >
            <Modal.Header closeButton>
              <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              {!isLoaded ? <ReactLoading type="spinningBubbles" color="#ffffff" height={300} width={300}/>
                :photos.map(photo => (
                  <Photo apiUrl={this.state.apiUrl} key={photo.id} id={photo.id} smallSize= {photo.small_size} fullSize= {photo.full_size} makeIsLoadedFalse={this.makeIsLoadedFalse.bind(this)}/>
                ))}
            </Modal.Body>

          </Modal>
        </>
      );
    }

}
export default ShowModal