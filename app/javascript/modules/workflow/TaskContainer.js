import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData, submitData } from 'modules/data';
import { getProject } from 'lib/utils';
import Task from './Task';

const mapStateToProps = (state) => {
    let project = getProject(state);
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
