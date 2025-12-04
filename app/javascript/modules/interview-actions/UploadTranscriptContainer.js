import { getArchiveId, getLocale, getProjectId } from 'modules/archive';
import { submitData } from 'modules/data';
import {
    getCurrentInterview,
    getCurrentProject,
    getLanguages,
} from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import UploadTranscript from './UploadTranscript';

const mapStateToProps = (state) => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    project: getCurrentProject(state),
    interview: getCurrentInterview(state),
    archiveId: getArchiveId(state),
    languages: getLanguages(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            submitData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(UploadTranscript);
