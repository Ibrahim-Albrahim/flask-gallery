import img404 from '../../assets/img404.jpg'
import '../../scss/GalleryEmpty.scss'


const GalleryEmpty = () => {
    return (  
        <section className='gallery-empty-section'>
            <h3>there is no photos in this gallery</h3>
            <img src={img404} />
        </section>
    )
};
export default GalleryEmpty;