import { connect } from 'react-redux';

import UploadTranscript from '../components/UploadTranscript';
import { submitData } from '../actions/dataActionCreators';
import { getInterview } from 'lib/utils';
import { getLocale, getProjectId, getArchiveId } from '../selectors/archiveSelectors';
import { getLanguages } from '../selectors/dataSelectors';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
        projects: state.data.projects,
    interview: getInterview(state),
    archiveId: getArchiveId(state),
    languages: getLanguages(state),
});

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadTranscript);
