import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import { getNormDataProviders, getProjects, getRegistryNameTypesForCurrentProject } from 'modules/data';
import RegistryNameForm from './RegistryNameForm';
import { getRegistryEntriesSearch } from 'modules/search';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        translations: getTranslations(state),
        registryNameTypes: getRegistryNameTypesForCurrentProject(state),
        normDataProviders: getNormDataProviders(state),
        foundRegistryEntries: getRegistryEntriesSearch(state),
    }
}

export default connect(mapStateToProps)(RegistryNameForm);
