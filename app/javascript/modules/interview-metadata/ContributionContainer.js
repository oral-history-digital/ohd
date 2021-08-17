import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData, deleteData, getProjects } from 'modules/data';
import { getLocale, getArchiveId, getProjectId } from 'modules/archive';
import Contribution from './Contribution';

const mapStateToProps = state => ({
    archiveId: getArchiveId(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    deleteData,
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Contribution);
