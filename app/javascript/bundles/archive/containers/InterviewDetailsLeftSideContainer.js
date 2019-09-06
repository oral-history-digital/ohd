import { connect } from 'react-redux';

import InterviewDetailsLeftSide from '../components/InterviewDetailsLeftSide';
import { getInterviewArchiveIdWithOffset } from '../../../lib/utils';
import { getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return { 
        archiveId: state.archive.archiveId,
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        translations: state.archive.translations,
        prevArchiveId: getInterviewArchiveIdWithOffset(state.archive.archiveId, state.search.archive.foundInterviews, -1),
        nextArchiveId: getInterviewArchiveIdWithOffset(state.archive.archiveId, state.search.archive.foundInterviews, 1),
    }
}

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewDetailsLeftSide);
