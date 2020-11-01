import { connect } from 'react-redux';

import RegistryNameForm from '../components/RegistryNameForm';
//import { submitData } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        translations: state.archive.translations,
        registryNameTypes: state.data.registry_name_types,
    }
}

const mapDispatchToProps = (dispatch) => ({
    //submitData: (props, params) => dispatch(submitData(props, params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistryNameForm);
