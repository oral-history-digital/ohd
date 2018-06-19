import { connect } from 'react-redux';

import UploadTranscript from '../components/UploadTranscript';
import { submitTranscript } from '../actions/interviewActionCreators';

//import ArchiveUtils from '../../../lib/utils';

// Which part of the Redux global state does our component want to receive as props?
const mapStateToProps = (state) => {
    return { 
        //data: ArchiveUtils.getInterview(state),
        locale: state.archive.locale,
        locales: state.archive.locales,
        archiveId: state.archive.archiveId,
        translations: state.archive.translations,
        collections: state.archive.collections,
        languages: state.archive.languages,
        account: state.account,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitTranscript: (params) => dispatch(submitTranscript(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(UploadTranscript);
