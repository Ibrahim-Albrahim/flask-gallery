import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './style.css';





ReactDOM.render(
  <React.StrictMode>
    
    <header className="app-header banner">
      <h1> 
        MyGallery
      </h1>
      <div>
          <a className="btn cold" href="/add-gallery"> Add Gallery </a>
          <a className="btn cold" href="/add-photo"> Add Photo </a>
      </div>
    </header>
    <App />


  </React.StrictMode>,
  document.getElementById('root')
);