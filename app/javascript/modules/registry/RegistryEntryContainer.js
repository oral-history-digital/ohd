import { connect } from 'react-redux';

import { openArchivePopup, closeArchivePopup } from 'modules/ui';
import { fetchData, deleteData } from 'modules/data';
import { addRemoveRegistryEntryId, getLocale, getTranslations, getSelectedRegistryEntryIds,
    getProjectId } from 'modules/archive';
import RegistryEntry from './RegistryEntry';

const mapStateToProps = (state) => ({
    projectId: getProjectId(state),
    projects: state.data.projects,
    locale: getLocale(state),
    translations: getTranslations(state),
    registryEntriesStatus: state.data.statuses.registry_entries,
    registryEntries: state.data.registry_entries,
    selectedRegistryEntryIds: getSelectedRegistryEntryIds(state),
});

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    deleteData: (props, dataType, id, nestedDataType, nestedId, skipRemove) => dispatch(deleteData(props, dataType, id, nestedDataType, nestedId, skipRemove)),
    addRemoveRegistryEntryId: (id) => dispatch(addRemoveRegistryEntryId(id)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntry);
