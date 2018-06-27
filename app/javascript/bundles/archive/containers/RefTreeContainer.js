import { connect } from 'react-redux';

import RefTree from '../components/RefTree';
import { 
    fetchInterviewData
} from '../actions/interviewActionCreators';

import ArchiveUtils from '../../../lib/utils';

const mapStateToProps = (state) => {
    let interview = ArchiveUtils.getInterview(state);
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        interview: interview
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchInterviewData: (archiveId, dataType) => dispatch(fetchInterviewData(archiveId, dataType)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RefTree);
