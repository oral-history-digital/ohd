import { connect } from 'react-redux';
import InterviewData from '../components/InterviewData';

import ArchiveUtils from '../../../lib/utils';


const mapStateToProps = (state) => {
    return {
        interview: ArchiveUtils.getInterview(state)
    }
}


export default connect(mapStateToProps)(InterviewData);
