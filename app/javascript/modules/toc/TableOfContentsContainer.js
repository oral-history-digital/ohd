import {connect} from 'react-redux';

import { fetchData, getCurrentInterview } from 'modules/data';
import { getLocale, getProjectId, getTranslations, getArchiveId } from 'modules/archive';
import { handleTranscriptScroll, getTranscriptScrollEnabled } from 'modules/interview';
import TableOfContents from './TableOfContents';

const mapStateToProps = (state) => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: state.data.projects,
    translations: getTranslations(state),
    archiveId: getArchiveId(state),
    interview: getCurrentInterview(state),
    headingsStatus: state.data.statuses.headings,
    transcriptScrollEnabled: getTranscriptScrollEnabled(state),
});

const mapDispatchToProps = (dispatch) => ({
    handleTranscriptScroll: bool => dispatch(handleTranscriptScroll(bool)),
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TableOfContents);
