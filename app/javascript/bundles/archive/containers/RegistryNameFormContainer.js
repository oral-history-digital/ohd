import { connect } from 'react-redux';

import RegistryNameForm from '../components/RegistryNameForm';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        translations: state.archive.translations,
        registryNameTypes: state.data.registry_name_types,
    }
}

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistryNameForm);
