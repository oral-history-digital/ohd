import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData, submitData, getCurrentInterview, getProjects, getCurrentAccount,
    getMarkTextStatus } from 'modules/data';
import { closeArchivePopup } from 'modules/ui';
import { getLocale, getProjectId, getArchiveId, getTranslations } from 'modules/archive';
import MarkTextForm from './MarkTextForm';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        archiveId: getArchiveId(state),
        translations: getTranslations(state),
        account: getCurrentAccount(state),
        interview: getCurrentInterview(state),
        markTextStatus: getMarkTextStatus(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    submitData,
    closeArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MarkTextForm);
