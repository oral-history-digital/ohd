import { connect } from 'react-redux';
import Carousel from '../components/Carousel';
import { getInterview } from '../../../lib/utils';


const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        photos: getInterview(state).photos,
        project: state.archive.project,
    }
}


export default connect(mapStateToProps)(Carousel);
