import { connect } from 'react-redux';
import InterviewSearch from '../components/InterviewSearch';
import { handleTranscriptScroll, getTranscriptScrollEnabled } from 'modules/interview';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        transcriptScrollEnabled: getTranscriptScrollEnabled(state),
        archiveId: state.archive.archiveId,
        interviews: state.data.interviews,
        interviewSearchResults: state.search.interviews,
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleTranscriptScroll: bool => dispatch(handleTranscriptScroll(bool)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewSearch);
