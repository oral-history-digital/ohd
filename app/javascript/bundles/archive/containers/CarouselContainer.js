import { connect } from 'react-redux';
import Carousel from '../components/Carousel';
import ArchiveUtils from '../../../lib/utils';


const mapStateToProps = (state) => {
    console.log(state);
    return {
        photos: ArchiveUtils.getInterview(state).interview.photos
    }
}


export default connect(mapStateToProps)(Carousel);
