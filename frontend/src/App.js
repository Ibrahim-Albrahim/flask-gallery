import React, {Component} from 'react';
import Gallery from './Gallery';
import AddGallery from './AddGallery';
import { Button, Container, Row, Col, Image, Nav, Modal} from 'react-bootstrap';

const apiUrl = 'http://localhost:5000/'



class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      galleries: [],
      isLoaded: false,
      showModal: false,
    }
  }

  componentDidMount(){
    fetch(apiUrl+'json')
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
              <a className="btn cold" onClick={() => this.setState({showModal: true})}> Add Gallery </a>
              <a className="btn cold" href="/add-photo"> Add Photo </a>
          </div>
        </header>

        <div className="images-container" >
          {galleries.map(gallery => (
            <Gallery key={gallery.id} id={gallery.id} pic= {gallery.img} title = {gallery.title}/>
          ))}
        </div>

        {this.state.showModal && 
          <AddGallery open>
            <Button variant="danger" className="btn-close" onClick={() => this.setState({showModal: false})}/>
        </AddGallery>
          }
      </div>
    );
  }
}

export default App;
