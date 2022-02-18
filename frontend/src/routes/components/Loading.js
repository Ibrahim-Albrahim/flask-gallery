import ReactLoading from 'react-loading';
import '../../scss/Loading.scss'

const Loading = () => {
    return  <ReactLoading type="spinningBubbles" color="#ffffff" height={200} width={200} className="spinning-bubbles"/>
};
export default Loading;