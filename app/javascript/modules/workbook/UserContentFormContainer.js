import { connect } from 'react-redux';

import { submitData, getCurrentInterview } from 'modules/data';
import { closeArchivePopup } from 'modules/ui';
import { getCurrentTape } from 'modules/interview';
import { getProject } from 'lib/utils';
import UserContentForm from './UserContentForm';

const mapStateToProps = (state) => {
    return {
        archiveId: state.archive.archiveId,
        project: getProject(state),
        interview: getCurrentInterview(state),
        tape: getCurrentTape(state),
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
