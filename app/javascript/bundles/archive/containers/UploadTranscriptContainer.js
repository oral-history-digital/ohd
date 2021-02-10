import { connect } from 'react-redux';

import UploadTranscript from '../components/UploadTranscript';
import { submitData } from 'modules/data';
import { getLocale, getProjectId, getArchiveId } from 'modules/archive';
import { getCurrentInterview, getLanguages } from 'modules/data';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: state.data.projects,
    interview: getCurrentInterview(state),
    archiveId: getArchiveId(state),
    languages: getLanguages(state),
});

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadTranscript);
