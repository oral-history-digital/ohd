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
        interviewer: data && data.interview.interviewers.length && data.interview.interviewers[0],
        transcriptor: data && data.interview.transcriptors.length && data.interview.transcriptors[0],
        translator: data && data.interview.translators.length && data.interview.translators[0],
        segmentator: data && data.interview.segmentators.length && data.interview.segmentators[0],
        account: state.account

    }
}


export default connect(mapStateToProps)(InterviewInfo);
