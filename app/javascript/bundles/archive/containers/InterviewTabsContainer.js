import {connect} from 'react-redux';
import InterviewTabs from '../components/InterviewTabs';
import { setInterviewTabIndex } from '../actions/interviewActionCreators';
import { getProject } from 'lib/utils';
import { getCurrentInterview } from '../selectors/dataSelectors';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        interview: getCurrentInterview(state),
        archiveId: state.archive.archiveId,
        translations: state.archive.translations,
        locale: state.archive.locale,
        interviewSearchResults: state.search.interviews[state.archive.archiveId],
        project: project && project.identifier,
        tabIndex: state.interview.tabIndex,
    }
}

const mapDispatchToProps = (dispatch) => ({
    setInterviewTabIndex: (tabIndex) => dispatch(setInterviewTabIndex(tabIndex)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewTabs);
