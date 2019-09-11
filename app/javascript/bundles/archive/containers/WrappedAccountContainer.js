import { connect } from 'react-redux';

import WrappedAccount from '../components/WrappedAccount';
import { submitData } from '../actions/dataActionCreators';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { getCookie } from '../../../lib/utils';
import { getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return { 
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        editView: getCookie('editView')
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(WrappedAccount);
