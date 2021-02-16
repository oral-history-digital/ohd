import { connect } from 'react-redux';

import { submitData } from 'modules/data';
import { getLocale, getProjectId, getArchiveId } from 'modules/archive';
import { getCurrentInterview, getLanguages, getProjects } from 'modules/data';
import UploadTranscript from './UploadTranscript';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    interview: getCurrentInterview(state),
    archiveId: getArchiveId(state),
    languages: getLanguages(state),
});

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadTranscript);
