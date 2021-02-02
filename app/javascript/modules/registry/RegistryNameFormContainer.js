import { connect } from 'react-redux';

import RegistryNameForm from './RegistryNameForm';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        translations: state.archive.translations,
        registryNameTypes: state.data.registry_name_types,
    }
}

export default connect(mapStateToProps)(RegistryNameForm);
