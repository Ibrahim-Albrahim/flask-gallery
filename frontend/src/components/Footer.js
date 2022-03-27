import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram , faSnapchatSquare} from '@fortawesome/free-brands-svg-icons'
import '../scss/Footer.scss'

const NoPage = () => {
    return  <footer >
                <a href='https://www.instagram.com/hemo7f12/' target='_blank' rel="noreferrer"><FontAwesomeIcon className='faInstagram' icon={faInstagram} /></a>
                <a href='https://www.snapchat.com/add/hemo7ss' target='_blank' rel="noreferrer"><FontAwesomeIcon className='faSnapchatSquare' icon={faSnapchatSquare} /></a>
            </footer>;
};

export default NoPage;