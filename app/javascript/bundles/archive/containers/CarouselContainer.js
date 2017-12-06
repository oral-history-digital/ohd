import { connect } from 'react-redux';
import Carousel from '../components/Carousel';
import ArchiveUtils from '../../../lib/utils';


const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        photos: ArchiveUtils.getInterview(state).interview.photos
    }
}


export default connect(mapStateToProps)(Carousel);
