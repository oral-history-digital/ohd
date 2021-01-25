import {connect} from 'react-redux';
import InterviewTabs from '../components/InterviewTabs';
import { getCurrentInterview } from '../selectors/dataSelectors';
import { getProject } from 'lib/utils';
import { setInterviewTabIndex, getTabIndex } from 'modules/interview';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        interview: getCurrentInterview(state),
        archiveId: state.archive.archiveId,
        translations: state.archive.translations,
        locale: state.archive.locale,
        interviewSearchResults: state.search.interviews[state.archive.archiveId],
        project: project && project.identifier,
        tabIndex: getTabIndex(state),
    }
}

const mapDispatchToProps = (dispatch) => ({
    setInterviewTabIndex: (tabIndex) => dispatch(setInterviewTabIndex(tabIndex)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewTabs);
