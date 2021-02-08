import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchInInterview } from 'modules/search';
import InterviewSearchForm from './InterviewSearchForm';

const mapStateToProps = (state) => {
    let data = state.search.interviews[state.archive.archiveId];
    return {
        archiveId: state.archive.archiveId,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        interviewFulltext: data && data.fulltext,
        translations: state.archive.translations,
        locale: state.archive.locale,
        isInterviewSearching: state.search.isInterviewSearching,
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    searchInInterview,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewSearchForm);
