import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData } from 'modules/data';
import { getProjectId, getArchiveId } from 'modules/archive';
import {
    getCurrentInterview,
    getLanguages,
    getCurrentProject,
} from 'modules/data';
import UploadEditTable from './UploadEditTable';

const mapStateToProps = (state) => ({
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

export default connect(mapStateToProps, mapDispatchToProps)(UploadEditTable);
