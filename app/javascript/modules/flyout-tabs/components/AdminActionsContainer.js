import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import { submitDois, addRemoveArchiveId, setArchiveIds, getArchiveId, getEditView, getLocale,
    getProjectId, getTranslations, getDoiResult } from 'modules/archive';
import { deleteData, submitData, getCurrentAccount, getProjects } from 'modules/data';
import { openArchivePopup, closeArchivePopup } from 'modules/ui';
import {  } from 'modules/archive';
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
    editView: getEditView(state),
    account: getCurrentAccount(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitDois,
    addRemoveArchiveId,
    setArchiveIds,
    deleteData,
    submitData,
    openArchivePopup,
    closeArchivePopup,
}, dispatch);

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminActions));
