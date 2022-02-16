import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import Home from './routes/Home';
import Error from './routes/Error'
import ViewGallery from './routes/ViewGallery'
import ViewPhoto from './routes/ViewPhoto'
import Manage from './routes/Manage'
import './scss/index.scss'
import Footer from '../src/routes/components/Footer'

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="gallery/:galleryId" element={<ViewGallery />} />
      <Route path="photo/:photoId" element={<ViewPhoto />} />
      <Route path="manage" element={<Manage />} />
      <Route path="*" element={<Navigate to="/error=404$Page Not Found" />} />
      <Route path="error=:status$:errorMsg" element={<Error />} />
    </Routes>
    <Footer />
  </BrowserRouter>,
  document.getElementById('root')
);

