import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setArchiveId, getLocale, getArchiveId, getProjectId, getTranslations } from 'modules/archive';
import { getCurrentProject, getCurrentUser } from 'modules/data';
import TaskPreview from './TaskPreview';

const mapStateToProps = (state) => {
    return {
        archiveId: getArchiveId(state),
        projectId: getProjectId(state),
        project: getCurrentProject(state),
        locale: getLocale(state),
        translations: getTranslations(state),
        user: getCurrentUser(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    setArchiveId,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TaskPreview);
