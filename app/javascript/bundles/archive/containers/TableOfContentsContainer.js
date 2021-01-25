import {connect} from 'react-redux';

import TableOfContents from '../components/TableOfContents';
import { fetchData } from '../actions/dataActionCreators';
import { getCurrentInterview } from '../selectors/dataSelectors';
import { handleTranscriptScroll, getTranscriptScrollEnabled } from 'modules/interview';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        interview: getCurrentInterview(state),
        headingsStatus: state.data.statuses.headings,
        transcriptScrollEnabled: getTranscriptScrollEnabled(state),
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleTranscriptScroll: bool => dispatch(handleTranscriptScroll(bool)),
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TableOfContents);
