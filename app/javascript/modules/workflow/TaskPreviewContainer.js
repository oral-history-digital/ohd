import { connect } from 'react-redux';

import { setArchiveId, getLocale, getArchiveId, getProjectId, getTranslations } from 'modules/archive';
import TaskPreview from './TaskPreview';

const mapStateToProps = (state) => {
    return {
        archiveId: getArchiveId(state),
        projectId: getProjectId(state),
        projects: state.data.projects,
        locale: getLocale(state),
        translations: getTranslations(state),
        account: state.data.accounts.current
    }
}

const mapDispatchToProps = (dispatch) => ({
    setArchiveId: (archiveId) => dispatch(setArchiveId(archiveId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TaskPreview);
