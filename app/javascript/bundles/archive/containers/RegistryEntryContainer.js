import { connect } from 'react-redux';

import RegistryEntry from '../components/RegistryEntry';
import { openArchivePopup, closeArchivePopup } from 'modules/ui';
import { fetchData, deleteData } from 'modules/data';
import { addRemoveRegistryEntryId, getLocale, getTranslations } from 'modules/archive';

const mapStateToProps = (state) => ({
    projectId: state.archive.projectId,
    projects: state.data.projects,
    locale: getLocale(state),
    translations: getTranslations(state),
    registryEntriesStatus: state.data.statuses.registry_entries,
    selectedRegistryEntryIds: state.archive.selectedRegistryEntryIds,
});

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    deleteData: (props, dataType, id, nestedDataType, nestedId, skipRemove) => dispatch(deleteData(props, dataType, id, nestedDataType, nestedId, skipRemove)),
    addRemoveRegistryEntryId: (id) => dispatch(addRemoveRegistryEntryId(id)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntry);
