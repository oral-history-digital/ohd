import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { openArchivePopup, closeArchivePopup } from 'modules/ui';
import { deleteData, fetchData, getCurrentAccount, getProjects, getRegistryEntries,
    getRegistryEntriesStatus } from 'modules/data';
import { getArchiveId, getEditView, getProjectId, getTranslations } from 'modules/archive';
import RegistryReference from './RegistryReference';

const mapStateToProps = state => ({
    archiveId: getArchiveId(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    translations: getTranslations(state),
    registryEntries: getRegistryEntries(state),
    account: getCurrentAccount(state),
    editView: getEditView(state),
    registryEntriesStatus: getRegistryEntriesStatus(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    deleteData,
    fetchData,
    openArchivePopup,
    closeArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistryReference);
