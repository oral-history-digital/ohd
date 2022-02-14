import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { addRemoveArchiveId, setArchiveIds, getArchiveId, getLocale,
    getProjectId, getTranslations, getDoiResult } from 'modules/archive';
import { deleteData, submitData, getProjects, getInterviewsStatus } from 'modules/data';
import { getArchiveFoundInterviews } from 'modules/search';
import AdminActions from './AdminActions';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    translations: getTranslations(state),
    archiveId: getArchiveId(state),
    statuses: getInterviewsStatus(state),
    doiResult: getDoiResult(state),
    archiveSearchResults: getArchiveFoundInterviews(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    addRemoveArchiveId,
    setArchiveIds,
    deleteData,
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AdminActions);
