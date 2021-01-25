import { connect } from 'react-redux';

import Segment from '../components/Segment';
import { openArchivePopup } from '../actions/archivePopupActionCreators';
import { getInterview } from 'lib/utils';
import { handleSegmentClick } from 'modules/interview';

const mapStateToProps = (state) => {
    return {
        translations: state.archive.translations,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        locale: state.archive.locale,
        interview: getInterview(state),
        userContents: state.data.user_contents,
        statuses: state.data.statuses.segments,
        account: state.data.accounts.current,
        editView: state.archive.editView,
        people: state.data.people,
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleSegmentClick: (tape, time, tabIndex) => dispatch(handleSegmentClick(tape, time, tabIndex)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(Segment);
