import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import { submitDois, addRemoveArchiveId, setArchiveIds, getArchiveId, getLocale,
    getProjectId, getTranslations, getDoiResult } from 'modules/archive';
import { deleteData, submitData, getProjects } from 'modules/data';
import AdminActions from './AdminActions';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    translations: getTranslations(state),
    archiveId: getArchiveId(state),
    statuses: state.data.statuses.interviews,
    doiResult: getDoiResult(state),
    archiveSearchResults: state.search.archive.foundInterviews,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitDois,
    addRemoveArchiveId,
    setArchiveIds,
    deleteData,
    submitData,
}, dispatch);

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminActions));
