import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { deleteData, getProjects } from 'modules/data';
import { getLocale, getProjectId, getArchiveId } from 'modules/archive';
import PhotoAdminButtons from './PhotoAdminButtons';

const mapStateToProps = state => ({
    archiveId: getArchiveId(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    deleteData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PhotoAdminButtons);
