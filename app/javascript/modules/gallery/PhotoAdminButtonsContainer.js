import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { deleteData, getCurrentProject } from 'modules/data';
import { getLocale, getProjectId, getArchiveId } from 'modules/archive';
import PhotoAdminButtons from './PhotoAdminButtons';

const mapStateToProps = state => ({
    archiveId: getArchiveId(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    project: getCurrentProject(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    deleteData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PhotoAdminButtons);
