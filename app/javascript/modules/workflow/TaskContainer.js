import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData, submitData, getCurrentProject, getProjects } from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import Task from './Task';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        translations: state.archive.translations,
        project: project,
        userAccounts: state.data.accounts,
        account: state.data.accounts.current,
        editView: state.archive.editView,
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Task);
