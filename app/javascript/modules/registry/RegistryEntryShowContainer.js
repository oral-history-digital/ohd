import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData, getProjects, getInterviews, getRegistryEntries } from 'modules/data';
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
        interviewsStatus: state.data.statuses.interviews,
        segments: state.data.segments,
        segmentsStatus: state.data.statuses.segments,
        translations: getTranslations(state),
        registryReferenceTypes: state.data.registry_reference_types,
        registryReferenceTypesStatus: state.data.statuses.registry_reference_types.all,
        registryEntriesStatus: state.data.statuses.registry_entries,
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
