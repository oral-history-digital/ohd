import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData } from 'modules/data';
import { closeArchivePopup } from 'modules/ui';
import { setArchiveId } from 'modules/archive';
import { sendTimeChangeRequest } from 'modules/media-player';
import RegistryEntryShow from './RegistryEntryShow';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        interviews: state.data.interviews,
        interviewsStatus: state.data.statuses.interviews,
        segments: state.data.segments,
        segmentsStatus: state.data.statuses.segments,
        translations: state.archive.translations,
        registryReferenceTypes: state.data.registry_reference_types,
        registryReferenceTypesStatus: state.data.statuses.registry_reference_types.all,
        registryEntriesStatus: state.data.statuses.registry_entries,
        registryEntries: state.data.registry_entries,
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    sendTimeChangeRequest,
    closeArchivePopup,
    setArchiveId,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntryShow);
