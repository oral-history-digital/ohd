import { connect } from 'react-redux';

import Account from '../components/Account';
import { submitLogout } from '../actions/accountActionCreators';
import { changeToEditView } from '../actions/archiveActionCreators';
import { hideFlyoutTabs } from '../actions/flyoutTabsActionCreators';
import { fetchData } from '../actions/dataActionCreators';
import { getCookie, getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return { 
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        translations: state.archive.translations,
        authStatus: state.account,
        account: state.data.accounts.current,
        accountsStatus: state.data.statuses.accounts,
        editView: getCookie('editView')
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitLogout: (url) => dispatch(submitLogout(url)),
    changeToEditView: (bool) => dispatch(changeToEditView(bool)),
    hideFlyoutTabs: () => dispatch(hideFlyoutTabs()),
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Account);
