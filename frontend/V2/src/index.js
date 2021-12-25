import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import Home from './routes/Home';
import NoPage from './routes/NoPage'
import ViewGallery from './routes/ViewGallery'
import ViewPhoto from './routes/ViewPhoto'
import './scss/index.scss'

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="gallery/:galleryId" element={<ViewGallery />} />
      <Route path="photo/:photoId" element={<ViewPhoto />} />
      <Route path="*" element={<NoPage />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

