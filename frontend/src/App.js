import React, {Component} from 'react';
import Gallery from './Gallery';
import AddGallery from './AddGallery';
import AddPhoto from './AddPhoto'
import { Button, Container, Row, Col, Image, Nav, Modal} from 'react-bootstrap';


class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      apiUrl: 'http://localhost:5000/',
      galleries: [],
      isLoaded: false,
      showAddGalleryModal: false,
      showAddPhotoModal: false,
    }
  }

  componentDidMount(){
    fetch(this.state.apiUrl+'json')
      .then(response => response.json())
      .then(json => {
        this.setState({
          isLoaded: true,
          galleries: json,
        })
      });
  }
  

  render(){
    var {isLoaded , galleries} = this.state;
    // console.log(isLoaded,galleries)

    return (
      <div className="app-header banner-two">
        <header className="app-header banner">
          <h1> 
            MyGallery
          </h1>
          <div>
              <a className="btn cold" onClick={() => this.setState({showAddGalleryModal: true})}> Add Gallery </a>
              <a className="btn cold" onClick={() => this.setState({showAddPhotoModal: true})}> Add Photo </a>
          </div>
        </header>

        <div className="images-container" >
          {galleries.map(gallery => (
            <Gallery apiUrl={this.state.apiUrl} key={gallery.id} id={gallery.id} pic= {gallery.img} title = {gallery.title}/>
          ))}
        </div>

        {this.state.showAddGalleryModal && 
          <AddGallery apiUrl={this.state.apiUrl} open>
            <Button variant="danger" className="btn-close" onClick={() => this.setState({showAddGalleryModal: false})}/>
          </AddGallery>
        }

        {this.state.showAddPhotoModal && 
          <AddPhoto apiUrl={this.state.apiUrl} open>
            <Button variant="danger" className="btn-close" onClick={() => this.setState({showAddPhotoModal: false})}/>
          </AddPhoto>
        }
      </div>
    );
  }
}

export default App;
