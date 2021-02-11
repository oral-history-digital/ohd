import {connect} from 'react-redux';

import { fetchData } from 'modules/data';
import { getCurrentInterview } from 'modules/data';
import { handleTranscriptScroll, getTranscriptScrollEnabled } from 'modules/video-player';
import TableOfContents from './TableOfContents';

const mapStateToProps = (state) => ({
    locale: state.archive.locale,
    projectId: state.archive.projectId,
    projects: state.data.projects,
    translations: state.archive.translations,
    archiveId: state.archive.archiveId,
    interview: getCurrentInterview(state),
    headingsStatus: state.data.statuses.headings,
    transcriptScrollEnabled: getTranscriptScrollEnabled(state),
});

const mapDispatchToProps = (dispatch) => ({
    handleTranscriptScroll: bool => dispatch(handleTranscriptScroll(bool)),
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TableOfContents);
