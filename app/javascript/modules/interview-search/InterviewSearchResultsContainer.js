import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchInInterview, getArchiveQueryFulltext } from 'modules/search';
import { setArchiveId, getLocale, getArchiveId, getTranslations, getProjectId } from 'modules/archive';
import { getProjects } from 'modules/data';
import { getMediaTime } from 'modules/media-player';
import InterviewSearchResults from './InterviewSearchResults';

const mapStateToProps = (state) => ({
    archiveId: getArchiveId(state),
    mediaTime: getMediaTime(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    translations: getTranslations(state),
    isInterviewSearching: state.search.isInterviewSearching,
    fulltext: getArchiveQueryFulltext(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    searchInInterview,
    setArchiveId,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewSearchResults);
