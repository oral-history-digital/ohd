import { connect } from 'react-redux';

import InterviewDetailsLeftSide from '../components/InterviewDetailsLeftSide';
import { getProject, getInterview, getInterviewee } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return { 
        archiveId: state.archive.archiveId,
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        interviewee: getInterviewee({interview: getInterview(state), people: state.data.people}),
        detailViewFields: project && project.detail_view_fields,
        translations: state.archive.translations,
        sortedArchiveIds: state.search.archive.sortedArchiveIds,
    }
}

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewDetailsLeftSide);
