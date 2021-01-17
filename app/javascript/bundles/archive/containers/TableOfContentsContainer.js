import {connect} from 'react-redux';

import TableOfContents from '../components/TableOfContents';
import { getInterview } from '../../../lib/utils';
import { handleTranscriptScroll } from '../actions/interviewActionCreators';
import { fetchData } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        locale: state.archive.locale,
        interview: getInterview(state),
        headingsStatus: state.data.statuses.headings,
        transcriptScrollEnabled: state.interview.transcriptScrollEnabled
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleTranscriptScroll: bool => dispatch(handleTranscriptScroll(bool)),
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TableOfContents);


