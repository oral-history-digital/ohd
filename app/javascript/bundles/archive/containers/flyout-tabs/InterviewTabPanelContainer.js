import { connect } from 'react-redux';

import InterviewTabPanel from '../../components/flyout-tabs/InterviewTabPanel';
import { getInterviewee, getProject } from 'lib/utils';
import { getCurrentInterview } from '../../selectors/interviewSelectors';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        archiveId: state.archive.archiveId,
        projectId: state.archive.projectId,
        interview: getCurrentInterview(state),
        interviewee: getInterviewee({interview: getCurrentInterview(state), people: state.data.people}),
        hasMap: project && project.has_map === 1,
        locale: state.archive.locale,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        editView: state.archive.editView,
    };
};

export default connect(mapStateToProps)(InterviewTabPanel);
