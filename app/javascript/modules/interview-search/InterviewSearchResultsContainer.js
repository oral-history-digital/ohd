import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchInInterview } from 'modules/search';
import { setArchiveId, getLocale, getArchiveId, getTranslations } from 'modules/archive';
import { getMediaTime } from 'modules/media-player';
import InterviewSearchResults from './InterviewSearchResults';

const mapStateToProps = (state) => ({
    archiveId: getArchiveId(state),
    mediaTime: getMediaTime(state),
    locale: getLocale(state),
    translations: getTranslations(state),
    isInterviewSearching: state.search.isInterviewSearching,
    fulltext: state.search.archive.query.fulltext,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    searchInInterview,
    setArchiveId,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewSearchResults);
