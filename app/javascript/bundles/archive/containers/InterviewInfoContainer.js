import { connect } from 'react-redux';
import InterviewInfo from '../components/InterviewInfo';

import { getInterview } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let interview = getInterview(state);
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        editView: state.archive.editView,
        interview: interview,
        cinematographer: interview && interview.cinematographers[0],
        interviewer: interview && interview.interviewers.length && interview.interviewers[0],
        transcriptor: interview && interview.transcriptors.length && interview.transcriptors[0],
        translator: interview && interview.translators.length && interview.translators[0],
        segmentators: interview && interview.segmentators.length && interview.segmentators,
        account: state.account,

    }
}


export default connect(mapStateToProps)(InterviewInfo);
