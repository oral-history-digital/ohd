import { connect } from 'react-redux';

import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import { getProjects, getRegistryNameTypes } from 'modules/data';
import RegistryNameForm from './RegistryNameForm';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        translations: getTranslations(state),
        registryNameTypes: getRegistryNameTypes(state),
    }
}

export default connect(mapStateToProps)(RegistryNameForm);
