import {connect} from 'react-redux';

import TableOfContents from '../components/TableOfContents';
import ArchiveUtils from '../../../lib/utils';
import { 
    handleTranscriptScroll,
    fetchInterviewData
} from '../actions/interviewActionCreators';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        interview: ArchiveUtils.getInterview(state),
        locale: state.archive.locale,
        transcriptScrollEnabled: state.archive.transcriptScrollEnabled
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleTranscriptScroll: bool => dispatch(handleTranscriptScroll(bool)),
    fetchInterviewData: (archiveId, dataType) => dispatch(fetchInterviewData(archiveId, dataType)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TableOfContents);


