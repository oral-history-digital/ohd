import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { submitData } from '../actions/dataActionCreators';
import { getLocale, getProjectId, getSelectedRegistryEntryIds } from '../selectors/archiveSelectors';
import MergeRegistryEntriesButton from '../components/MergeRegistryEntriesButton';

const mapStateToProps = (state) => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    selectedRegistryEntryIds: getSelectedRegistryEntryIds(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
    openArchivePopup,
    closeArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MergeRegistryEntriesButton);
