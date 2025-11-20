import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    fetchData,
    getProjects,
    getProjectLocales,
    getRegistryEntries,
    getRegistryEntriesStatus,
} from 'modules/data';
import RegistryEntrySelect from './RegistryEntrySelect';

const mapStateToProps = (state) => ({
    locales: getProjectLocales(state),
    projects: getProjects(state),
    registryEntries: getRegistryEntries(state),
    registryEntriesStatus: getRegistryEntriesStatus(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            fetchData,
        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RegistryEntrySelect);
