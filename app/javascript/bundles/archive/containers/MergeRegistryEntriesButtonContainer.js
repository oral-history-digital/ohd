import { connect } from 'react-redux';

import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { submitData } from '../actions/dataActionCreators';
import { getLocale, getProjectId, getSelectedRegistryEntryIds } from '../selectors/archiveSelectors';
import MergeRegistryEntriesButton from '../components/MergeRegistryEntriesButton';

const mapStateToProps = (state) => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    selectedRegistryEntryIds: getSelectedRegistryEntryIds(state),
});

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MergeRegistryEntriesButton);
