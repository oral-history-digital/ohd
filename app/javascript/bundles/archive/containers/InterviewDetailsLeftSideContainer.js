import { connect } from 'react-redux';

import InterviewDetailsLeftSide from '../components/InterviewDetailsLeftSide';
import { getProject, getInterview, getInterviewee } from '../../../lib/utils';
import { searchInArchive } from 'modules/search';
import { getCurrentInterview } from '../selectors/dataSelectors';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        archiveId: state.archive.archiveId,
        interview: getCurrentInterview(state),
        foundInterviews: state.search.archive.foundInterviews,
        interviewee: getInterviewee({interview: getInterview(state), people: state.data.people}),
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        query: state.search.archive.query,
        sortedArchiveIds: state.search.archive.sortedArchiveIds,
        translations: state.archive.translations,
    }
}

const mapDispatchToProps = (dispatch) => ({
    searchInArchive: (url, query) => dispatch(searchInArchive(url, query)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewDetailsLeftSide);
