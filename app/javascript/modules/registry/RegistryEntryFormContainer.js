import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData, getCurrentProject, getRegistryEntries, getNormDataProviders } from 'modules/data';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import RegistryEntryForm from './RegistryEntryForm';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    project: getCurrentProject(state),
    normDataProviders: getNormDataProviders(state),
    translations: getTranslations(state),
    registryEntries: getRegistryEntries(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntryForm);
