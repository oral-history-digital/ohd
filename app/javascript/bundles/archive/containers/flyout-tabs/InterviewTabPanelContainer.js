import { connect } from 'react-redux';

import InterviewTabPanel from '../../components/flyout-tabs/InterviewTabPanel';
import { getInterview, getInterviewee, getProject } from '../../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        archiveId: state.archive.archiveId,
        projectId: state.archive.projectId,
        interview: getInterview(state),
        interviewee: getInterviewee({interview: getInterview(state), people: state.data.people}),
        hasMap: project && project.has_map === 1,
        locale: state.archive.locale,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        editView: state.archive.editView,
    };
};

export default connect(mapStateToProps)(InterviewTabPanel);
