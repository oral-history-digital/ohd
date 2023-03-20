import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData, submitData, getCurrentInterview, getCurrentProject, getCurrentUser,
    getMarkTextStatus } from 'modules/data';
import { getLocale, getProjectId, getArchiveId, getTranslations } from 'modules/archive';
import MarkTextForm from './MarkTextForm';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        project: getCurrentProject(state),
        archiveId: getArchiveId(state),
        translations: getTranslations(state),
        user: getCurrentUser(state),
        interview: getCurrentInterview(state),
        markTextStatus: getMarkTextStatus(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MarkTextForm);
