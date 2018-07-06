import { connect } from 'react-redux';

import UserContentForm from '../components/UserContentForm';
import { submitUserContent } from '../actions/userContentActionCreators';
import { closeArchivePopup } from '../actions/archivePopupActionCreators';

import { getInterview } from '../../../lib/utils';

const mapStateToProps = (state) => {
    return { 
        archiveId: state.archive.archiveId,
        interview: getInterview(state),
        tape: state.interview.tape,
        locale: state.archive.locale,
        translations: state.archive.translations,
        externalLinks:  state.archive.externalLinks,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitUserContent: (params) => dispatch(submitUserContent(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(UserContentForm);
