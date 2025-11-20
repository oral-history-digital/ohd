import { getArchiveId, getProjectId } from 'modules/archive';
import { submitData } from 'modules/data';
import {
    getCurrentInterview,
    getCurrentProject,
    getLanguages,
} from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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
