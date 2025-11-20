import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    changeRegistryEntriesViewMode,
    getShowRegistryEntriesSearchResults,
} from 'modules/search';
import { getProjectLocales } from 'modules/data';
import RegistryEntriesTabPanel from './RegistryEntriesTabPanel';

const mapStateToProps = (state) => ({
    showRegistryEntriesSearchResults:
        getShowRegistryEntriesSearchResults(state),
    locales: getProjectLocales(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            changeRegistryEntriesViewMode,
        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RegistryEntriesTabPanel);
