import { connect } from 'react-redux';

import EditInterview from '../components/EditInterview';
import { submitInterview } from '../actions/interviewActionCreators';

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
        account: state.account,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitInterview: (params) => dispatch(submitInterview(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(EditInterview);
