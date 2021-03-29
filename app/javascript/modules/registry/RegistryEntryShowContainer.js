import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData, getProjects, getInterviews, getRegistryEntries, getInterviewsStatus,
    getRegistryEntriesStatus, getRegistryReferenceTypes, getRegistryReferenceTypesStatus,
    getSegmentsStatus } from 'modules/data';
import { closeArchivePopup } from 'modules/ui';
import { setArchiveId, getLocale, getProjectId, getTranslations } from 'modules/archive';
import { sendTimeChangeRequest } from 'modules/media-player';
import RegistryEntryShow from './RegistryEntryShow';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        interviews: getInterviews(state),
        interviewsStatus: getInterviewsStatus(state),
        segments: state.data.segments,
        segmentsStatus: getSegmentsStatus(state),
        translations: getTranslations(state),
        registryReferenceTypes: getRegistryReferenceTypes(state),
        registryReferenceTypesStatus: getRegistryReferenceTypesStatus(state).all,
        registryEntriesStatus:getRegistryEntriesStatus(state),
        registryEntries: getRegistryEntries(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    sendTimeChangeRequest,
    closeArchivePopup,
    setArchiveId,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntryShow);
