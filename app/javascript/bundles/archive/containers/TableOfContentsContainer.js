import {connect} from 'react-redux';

import TableOfContents from '../components/TableOfContents';
import { getInterview } from '../../../lib/utils';
import { handleTranscriptScroll } from '../actions/interviewActionCreators';
import { fetchData } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        locale: state.archive.locale,
        interview: getInterview(state),
        transcriptScrollEnabled: state.interview.transcriptScrollEnabled
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleTranscriptScroll: bool => dispatch(handleTranscriptScroll(bool)),
    fetchData: (dataType, archiveId, nestedDataType) => dispatch(fetchData(dataType, archiveId, nestedDataType)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TableOfContents);


