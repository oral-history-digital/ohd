import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setArchiveId, addRemoveArchiveId, getLocale, getSelectedArchiveIds } from 'modules/archive';
import { getCurrentProject, getProjects, getInterviewsStatus } from 'modules/data';
import InterviewPreview from './InterviewPreview';

const mapStateToProps = (state) => ({
    locale: getLocale(state),
    project: getCurrentProject(state),
    projects: getProjects(state),
    selectedArchiveIds: getSelectedArchiveIds(state),
    statuses: getInterviewsStatus(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setArchiveId,
    addRemoveArchiveId,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewPreview);
