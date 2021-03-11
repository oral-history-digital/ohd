import { connect } from 'react-redux';

import { submitData, getCurrentProject, getCurrentInterview } from 'modules/data';
import { closeArchivePopup } from 'modules/ui';
import { getCurrentTape } from 'modules/media-player';
import UserContentForm from './UserContentForm';

const mapStateToProps = (state) => {
    return {
        archiveId: state.archive.archiveId,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        project: getCurrentProject(state),
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
