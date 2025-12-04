import {
    addRemoveArchiveId,
    getSelectedArchiveIds,
    setArchiveId,
} from 'modules/archive';
import { getInterviewsStatus, getProjects } from 'modules/data';
import { getIsLoggedIn } from 'modules/user';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import InterviewPreview from './InterviewPreview';

const mapStateToProps = (state) => ({
    projects: getProjects(state),
    selectedArchiveIds: getSelectedArchiveIds(state),
    statuses: getInterviewsStatus(state),
    isLoggedIn: getIsLoggedIn(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            setArchiveId,
            addRemoveArchiveId,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(InterviewPreview);
