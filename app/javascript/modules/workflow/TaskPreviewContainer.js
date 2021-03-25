import { connect } from 'react-redux';

import { setArchiveId, getLocale, getArchiveId, getProjectId, getTranslations } from 'modules/archive';
import { getProjects, getCurrentAccount } from 'modules/data';
import TaskPreview from './TaskPreview';

const mapStateToProps = (state) => {
    return {
        archiveId: getArchiveId(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        locale: getLocale(state),
        translations: getTranslations(state),
        account: getCurrentAccount(state),
    }
}

const mapDispatchToProps = (dispatch) => ({
    setArchiveId: (archiveId) => dispatch(setArchiveId(archiveId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TaskPreview);
