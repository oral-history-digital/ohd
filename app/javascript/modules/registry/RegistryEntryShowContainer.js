import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData, getProjects, getInterviews, getRegistryEntries, getInterviewsStatus,
    getRegistryEntriesStatus, getRegistryReferenceTypesForCurrentProject, getRegistryReferenceTypesStatus,
    getSegments, getSegmentsStatus, getCurrentAccount, getCurrentProject } from 'modules/data';
import { setArchiveId, getLocale, getProjectId, getTranslations, getEditView } from 'modules/archive';
import { sendTimeChangeRequest } from 'modules/media-player';
import RegistryEntryShow from './RegistryEntryShow';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    project: getCurrentProject(state),
    interviews: getInterviews(state),
    interviewsStatus: getInterviewsStatus(state),
    segments: getSegments(state),
    segmentsStatus: getSegmentsStatus(state),
    translations: getTranslations(state),
    registryReferenceTypes: getRegistryReferenceTypesForCurrentProject(state),
    registryReferenceTypesStatus: getRegistryReferenceTypesStatus(state),
    registryEntriesStatus:getRegistryEntriesStatus(state),
    registryEntries: getRegistryEntries(state),
    editView: getEditView(state),
    account: getCurrentAccount(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    sendTimeChangeRequest,
    setArchiveId,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntryShow);
