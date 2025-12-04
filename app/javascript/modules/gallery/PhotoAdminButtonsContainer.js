import { getArchiveId, getLocale, getProjectId } from 'modules/archive';
import { deleteData, getCurrentProject } from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import PhotoAdminButtons from './PhotoAdminButtons';

const mapStateToProps = (state) => ({
    archiveId: getArchiveId(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    project: getCurrentProject(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            deleteData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(PhotoAdminButtons);
