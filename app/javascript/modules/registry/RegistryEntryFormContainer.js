import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData, getProjects, getRegistryEntries } from 'modules/data';
import { closeArchivePopup } from 'modules/ui';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import RegistryEntryForm from './RegistryEntryForm';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    translations: getTranslations(state),
    registryEntries: getRegistryEntries(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
    closeArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntryForm);
