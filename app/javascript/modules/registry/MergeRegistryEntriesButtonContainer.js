import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { openArchivePopup, closeArchivePopup } from 'modules/ui';
import { submitData } from 'modules/data';
import { getLocale, getProjectId, getSelectedRegistryEntryIds } from 'modules/archive';
import MergeRegistryEntriesButton from './MergeRegistryEntriesButton';

const mapStateToProps = (state) => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
        projects: state.data.projects,
    selectedRegistryEntryIds: getSelectedRegistryEntryIds(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
    openArchivePopup,
    closeArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MergeRegistryEntriesButton);