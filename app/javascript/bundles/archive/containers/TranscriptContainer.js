import { connect } from 'react-redux';

import Transcript from '../components/Transcript';
import { handleTranscriptScroll, setActualSegment } from '../actions/interviewActionCreators';
import { fetchData } from '../actions/dataActionCreators';

import { getInterview } from '../../../lib/utils';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        contributionTypes: state.archive.contributionTypes,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        interview: getInterview(state),
        people: state.data.people,
        tape: state.interview.tape,
        transcriptTime: state.interview.transcriptTime,
        transcriptScrollEnabled: state.interview.transcriptScrollEnabled,
        segmentsStatus: state.data.statuses.segments,
        userContentsStatus: state.data.statuses.user_contents.all,
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleTranscriptScroll: bool => dispatch(handleTranscriptScroll(bool)),
    setActualSegment: segment => dispatch(setActualSegment(segment)),
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Transcript);
