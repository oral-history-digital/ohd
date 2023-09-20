import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setArchiveId, addRemoveArchiveId, getSelectedArchiveIds } from 'modules/archive';
import { getLanguages, getCollections, getProjects } from 'modules/data';

import InterviewListRow from './InterviewListRow';

const mapStateToProps = (state) => ({
    projects: getProjects(state),
    selectedArchiveIds: getSelectedArchiveIds(state),
    languages: getLanguages(state),
    collections: getCollections(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setArchiveId,
    addRemoveArchiveId,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewListRow);
