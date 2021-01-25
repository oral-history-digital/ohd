import { connect } from 'react-redux';

import RegistryEntryShow from '../components/RegistryEntryShow';
import { fetchData } from '../actions/dataActionCreators';
import { closeArchivePopup } from '../actions/archivePopupActionCreators';
import { setArchiveId } from '../actions/archiveActionCreators';
import { setTapeAndTime } from 'modules/interview';

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

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    setTapeAndTime: (tape, time) => dispatch(setTapeAndTime(tape, time)),
    closeArchivePopup: () => dispatch(closeArchivePopup()),
    setArchiveId: (archiveId) => dispatch(setArchiveId(archiveId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntryShow);
