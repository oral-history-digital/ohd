import { connect } from 'react-redux';
import AuthShow from '../components/AuthShow';
import { fetchData } from '../actions/dataActionCreators';
import { getCookie, getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        isLoggedIn: state.account.isLoggedIn,
        isLoggedOut: state.account.isLoggedOut,
        account: state.data.accounts.current,
        accountsStatus: state.data.statuses.accounts,
        editView: state.archive.editView,
        projectId: project && project.identifier,
        locale: state.archive.locale
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthShow);
