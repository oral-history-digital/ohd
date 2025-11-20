import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    changeRegistryEntriesViewMode,
    searchRegistryEntry,
} from 'modules/search';
import { hideSidebar } from 'modules/sidebar';
import RegistrySearchForm from './RegistrySearchForm';

const mapStateToProps = (state) => ({
    isRegistryEntrySearching: state.search.isRegistryEntrySearching,
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            searchRegistryEntry,
            changeRegistryEntriesViewMode,
            hideSidebar,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(RegistrySearchForm);
