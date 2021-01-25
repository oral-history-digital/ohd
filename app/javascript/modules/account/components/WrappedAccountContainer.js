import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { submitData } from 'bundles/archive/actions/dataActionCreators';
import { openArchivePopup, closeArchivePopup } from 'bundles/archive/actions/archivePopupActionCreators';
import { getProject } from 'lib/utils';
import { setFlyoutTabsIndex } from 'modules/flyout-tabs';
import WrappedAccount from './WrappedAccount';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        editView: state.archive.editView,
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
    openArchivePopup,
    closeArchivePopup,
    setFlyoutTabsIndex,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedAccount);
