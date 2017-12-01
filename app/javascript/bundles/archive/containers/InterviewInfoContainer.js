import { connect } from 'react-redux';
import InterviewInfo from '../components/InterviewInfo';

import ArchiveUtils from '../../../lib/utils';


const mapStateToProps = (state) => {
    let data = ArchiveUtils.getInterview(state);
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        interview: data && data.interview,
        cinematographer: data && data.interview.cinematographers[0],
        interviewer: data && data.interview.interviewers[0]

    }
}


export default connect(mapStateToProps)(InterviewInfo);