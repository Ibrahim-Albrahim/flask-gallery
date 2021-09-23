import React, {Component} from 'react';
import Gallery from './Gallery';

const apiUrl = 'http://localhost:5000/'



class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      galleries: [],
      isLoaded: false,
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

    //TODO: progress indicator.


    return (
      <div className="images-container" >
        {galleries.map(gallery => (
          <Gallery key={gallery.id} id={gallery.id} pic= {gallery.img} title = {gallery.title}/>
        ))}
      </div>
    );
  }
}

export default App;
