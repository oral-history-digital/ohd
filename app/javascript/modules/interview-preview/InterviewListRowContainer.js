import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setArchiveId, addRemoveArchiveId, getSelectedArchiveIds } from 'modules/archive';
import { getLanguages, getCollectionsForCurrentProject } from 'modules/data';
import InterviewListRow from './InterviewListRow';

const mapStateToProps = (state) => ({
    selectedArchiveIds: getSelectedArchiveIds(state),
    languages: getLanguages(state),
    collections: getCollectionsForCurrentProject(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setArchiveId,
    addRemoveArchiveId,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewListRow);
