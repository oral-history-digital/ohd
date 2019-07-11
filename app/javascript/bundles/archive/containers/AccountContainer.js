import { connect } from 'react-redux';

import Account from '../components/Account';
import { submitLogout } from '../actions/accountActionCreators';
import { changeToEditView } from '../actions/archiveActionCreators';
import { hideFlyoutTabs } from '../actions/flyoutTabsActionCreators';
import { fetchData } from '../actions/dataActionCreators';
import { getCookie } from '../../../lib/utils';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        translations: state.archive.translations,
        authStatus: state.account,
        account: state.data.accounts.current,
        accountsStatus: state.data.statuses.accounts,
        editView: getCookie('editView')
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitLogout: () => dispatch(submitLogout()),
    changeToEditView: (bool) => dispatch(changeToEditView(bool)),
    hideFlyoutTabs: () => dispatch(hideFlyoutTabs()),
    fetchData: (dataType, id, nestedDataType, locale, extraParams) => dispatch(fetchData(dataType, id, nestedDataType, locale, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Account);
