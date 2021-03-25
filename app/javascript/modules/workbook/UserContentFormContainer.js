import { connect } from 'react-redux';

import { submitData, getCurrentProject, getCurrentInterview, getProjects } from 'modules/data';
import { getLocale, getArchiveId, getProjectId, getTranslations } from 'modules/archive';
import { closeArchivePopup } from 'modules/ui';
import { getCurrentTape } from 'modules/media-player';
import UserContentForm from './UserContentForm';

const mapStateToProps = (state) => {
    return {
        archiveId: getArchiveId(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        project: getCurrentProject(state),
        interview: getCurrentInterview(state),
        tape: getCurrentTape(state),
        locale: getLocale(state),
        translations: getTranslations(state),
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(UserContentForm);
