import { connect } from 'react-redux';

import UserContentForm from '../components/UserContentForm';
import { submitData } from '../actions/dataActionCreators';
import { closeArchivePopup } from '../actions/archivePopupActionCreators';

import { getInterview, getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    return {
        archiveId: state.archive.archiveId,
        project: getProject(state),
        interview: getInterview(state),
        tape: state.interview.tape,
        locale: state.archive.locale,
        translations: state.archive.translations,
        externalLinks:  state.archive.externalLinks,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(UserContentForm);
