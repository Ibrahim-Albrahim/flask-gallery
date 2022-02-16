import '../../scss/Header.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom';

const Header = (props) => {
    return  (
        <header>
            <Link to={props.headerLink}><FontAwesomeIcon className='fa-icon' icon={props.icon} /></Link>
            <h1>{props.headerText}</h1>
        </header>
    )
};
export default Header;