import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getArchiveId, getProjectId, getTranslations } from 'modules/archive';
import { getProjects } from 'modules/data';
import { searchInInterview } from 'modules/search';
import InterviewSearchForm from './InterviewSearchForm';

const mapStateToProps = (state) => {
    let data = state.search.interviews[getArchiveId(state)];

    return {
        archiveId: getArchiveId(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        interviewFulltext: data && data.fulltext,
        translations: getTranslations(state),
        locale: getLocale(state),
        isInterviewSearching: state.search.isInterviewSearching,
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    searchInInterview,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewSearchForm);
