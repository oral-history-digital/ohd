import { connect } from 'react-redux';

import Account from '../components/Account';
import { submitLogout } from '../actions/accountActionCreators';
import { fetchData } from '../actions/dataActionCreators';
import { changeToEditView } from '../actions/archiveActionCreators';
import { hideFlyoutTabs } from '../actions/flyoutTabsActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        translations: state.archive.translations,
        authStatus: state.account,
        account: state.data.accounts.current,
        accountsStatus: state.data.statuses.accounts,
        editView: state.archive.editView
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitLogout: () => dispatch(submitLogout()),
    fetchData: (dataType, id, nestedDataType, locale, extraParams) => dispatch(fetchData(dataType, id, nestedDataType, locale, extraParams)),
    changeToEditView: (bool) => dispatch(changeToEditView(bool)),
    hideFlyoutTabs: () => dispatch(hideFlyoutTabs()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Account);
