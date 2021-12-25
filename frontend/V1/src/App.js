import React, {Component} from 'react';
import Gallery from './Gallery';
import AddGallery from './AddGallery';
import AddPhoto from './AddPhoto'
import ReactLoading from 'react-loading';
import './css/app.css';



class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      // apiUrl: 'http://192.168.43.41:5000/',
      apiUrl: 'http://hemo7f12.me:5000/',
      galleries: [],
      isLoaded: false,
    }
  }

  getData () {
    fetch(this.state.apiUrl)
    .then(response => response.json())
    .then(json => {
      this.setState({
        isLoaded: true,
        galleries: json,
      })
    });
  }

  makeIsLoadedFalse () {
    this.setState({
      isLoaded: false,
    })
  }

  render(){
    var {isLoaded , galleries} = this.state;



    !isLoaded ? this.getData() :null



    return (

      // !isLoaded ? <ReactLoading type="spinningBubbles" color="#ffffff" height={300} width={300} className="spinning-bubbles"/>
      // : 
      <div className="app-header banner-two">
          <header className="app-header banner">
            <h1> 
              MyGallery
            </h1>
            <div>
                <AddGallery apiUrl={this.state.apiUrl}  makeIsLoadedFalse={this.makeIsLoadedFalse.bind(this)} />
                <AddPhoto apiUrl={this.state.apiUrl}  makeIsLoadedFalse={this.makeIsLoadedFalse.bind(this)} />
            </div>
          </header>

          <div className="images-container" >
            {galleries.map(gallery => (
              <Gallery apiUrl={this.state.apiUrl} key={gallery.id} id={gallery.id} pic= {gallery.img} title = {gallery.title} makeIsLoadedFalse={this.makeIsLoadedFalse.bind(this)}/>
            ))}
          </div>
        </div>
      

    );
  }
}

export default App;
