import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData, submitData, getCurrentProject, getAccounts, getCurrentAccount } from 'modules/data';
import { getLocale, getProjectId, getTranslations, getEditView } from 'modules/archive';
import Task from './Task';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        translations: getTranslations(state),
        project: project,
        userAccounts: getAccounts(state),
        account: getCurrentAccount(state),
        editView: getEditView(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Task);
