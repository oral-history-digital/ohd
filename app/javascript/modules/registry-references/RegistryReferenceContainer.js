import {
    deleteData,
    fetchData,
    getRegistryEntries,
    getRegistryEntriesStatus,
} from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import RegistryReference from './RegistryReference';

const mapStateToProps = (state) => ({
    registryEntries: getRegistryEntries(state),
    registryEntriesStatus: getRegistryEntriesStatus(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            deleteData,
            fetchData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(RegistryReference);
