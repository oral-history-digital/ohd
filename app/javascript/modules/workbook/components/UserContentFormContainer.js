import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentProject, getCurrentInterview, getProjects } from 'modules/data';
import { getLocale, getArchiveId, getProjectId, getTranslations } from 'modules/archive';
import { closeArchivePopup } from 'modules/ui';
import { getCurrentTape } from 'modules/media-player';
import { createWorkbook, updateWorkbook } from '../actions';
import UserContentForm from './UserContentForm';

const mapStateToProps = state => ({
    archiveId: getArchiveId(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    project: getCurrentProject(state),
    interview: getCurrentInterview(state),
    tape: getCurrentTape(state),
    locale: getLocale(state),
    translations: getTranslations(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    createWorkbook,
    updateWorkbook,
    closeArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserContentForm);