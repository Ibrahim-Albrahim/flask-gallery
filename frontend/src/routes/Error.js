import React  from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons'
import '../scss/Error.scss'


const Error = () => {
  const {errorMsg , status} = useParams()
    return (
      <div className='error-container'>
        <Header headerText={ status }  icon={faArrowAltCircleLeft} headerLink='/'/>
        <section>
          <h1>{errorMsg}</h1>
        </section>
      </div>
    )
  };
  export default Error;