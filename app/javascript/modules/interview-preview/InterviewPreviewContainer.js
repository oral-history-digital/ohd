import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setArchiveId, addRemoveArchiveId, getSelectedArchiveIds } from 'modules/archive';
import { getProjects, getInterviewsStatus } from 'modules/data';
import InterviewPreview from './InterviewPreview';

const mapStateToProps = (state) => ({
    projects: getProjects(state),
    selectedArchiveIds: getSelectedArchiveIds(state),
    statuses: getInterviewsStatus(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setArchiveId,
    addRemoveArchiveId,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewPreview);
