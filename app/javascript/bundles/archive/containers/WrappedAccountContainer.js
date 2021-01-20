import { connect } from 'react-redux';

import WrappedAccount from '../components/WrappedAccount';
import { submitData } from '../actions/dataActionCreators';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { setFlyoutTabsIndex } from 'modules/flyout-tabs';
import { getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        editView: state.archive.editView,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup()),
    setFlyoutTabsIndex: index => dispatch(setFlyoutTabsIndex(index)),
})

export default connect(mapStateToProps, mapDispatchToProps)(WrappedAccount);
