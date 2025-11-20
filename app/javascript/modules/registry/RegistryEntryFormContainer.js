import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    submitData,
    getRegistryEntries,
    getNormDataProviders,
} from 'modules/data';
import RegistryEntryForm from './RegistryEntryForm';

const mapStateToProps = (state) => ({
    normDataProviders: getNormDataProviders(state),
    registryEntries: getRegistryEntries(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            submitData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntryForm);
