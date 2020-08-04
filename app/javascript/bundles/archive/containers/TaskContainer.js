import { connect } from 'react-redux';

import Task from '../components/Task';
import { fetchData } from '../actions/dataActionCreators';
import { getProject } from '../../../lib/utils';

const mapStateToProps = (state, ownProps) => {
    let project = getProject(state);
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        project: project,
        tasks: state.data.tasks,
        tasksStatus: state.data.statuses.tasks,
        userAccounts: state.data.user_accounts
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
})

// Don't forget to actually use connect!
// Note that we don't export Search, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(mapStateToProps, mapDispatchToProps)(Task);
