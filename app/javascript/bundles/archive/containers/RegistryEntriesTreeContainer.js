import { connect } from 'react-redux';

import RegistryEntriesTree from '../components/RegistryEntriesTree';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { submitData } from '../actions/dataActionCreators';
import { setFlyoutTabsIndex } from '../actions/flyoutTabsActionCreators';
import { getRootRegistryEntry } from '../selectors/dataSelectors';
import { getLocale, getProjectId, getSelectedRegistryEntryIds } from '../selectors/archiveSelectors';
import { getIsRegistryEntrySearching, getRegistryEntriesSearch, getShowRegistryEntriesTree } from '../selectors/searchSelectors';

const mapStateToProps = (state) => ({
    rootRegistryEntry: getRootRegistryEntry(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    foundRegistryEntries: getRegistryEntriesSearch(state),
    showRegistryEntriesTree: getShowRegistryEntriesTree(state),
    selectedRegistryEntryIds: getSelectedRegistryEntryIds(state),
    isRegistryEntrySearching: getIsRegistryEntrySearching(state),
});

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup()),
    setFlyoutTabsIndex: index => dispatch(setFlyoutTabsIndex(index)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntriesTree);
