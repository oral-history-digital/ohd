import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData, submitData, getCurrentProject } from 'modules/data';
import Task from './Task';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: state.archive.locale,
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
