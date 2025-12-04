import { submitData } from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import RegistryHierarchyForm from './RegistryHierarchyForm';

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            submitData,
        },
        dispatch
    );

export default connect(undefined, mapDispatchToProps)(RegistryHierarchyForm);
