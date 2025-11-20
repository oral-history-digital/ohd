import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData } from 'modules/data';
import RegistryHierarchyForm from './RegistryHierarchyForm';

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            submitData,
        },
        dispatch
    );

export default connect(undefined, mapDispatchToProps)(RegistryHierarchyForm);
