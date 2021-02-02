import { connect } from 'react-redux';

import Transcript from '../components/Transcript';
import { fetchData } from 'modules/data';
import { getCurrentInterview } from 'modules/data';
import { handleTranscriptScroll, setActualSegment, getCurrentTape, getTranscriptScrollEnabled, getTranscriptTime } from 'modules/interview';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        contributionTypes: state.archive.contributionTypes,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        interview: getCurrentInterview(state),
        people: state.data.people,
        tape: getCurrentTape(state),
        transcriptTime: getTranscriptTime(state),
        transcriptScrollEnabled: getTranscriptScrollEnabled(state),
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
