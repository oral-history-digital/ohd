import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData, getProjects } from 'modules/data';
import { getLocale, getProjectId, getSelectedRegistryEntryIds } from 'modules/archive';
import MergeRegistryEntriesButton from './MergeRegistryEntriesButton';

const mapStateToProps = (state) => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    selectedRegistryEntryIds: getSelectedRegistryEntryIds(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MergeRegistryEntriesButton);
