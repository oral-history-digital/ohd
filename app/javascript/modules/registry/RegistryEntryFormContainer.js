import {
    getNormDataProviders,
    getRegistryEntries,
    submitData,
} from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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
