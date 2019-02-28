import { connect } from 'react-redux';

import FlyoutTabs from '../components/FlyoutTabs';
import { openArchivePopup } from '../actions/archivePopupActionCreators';
import { setLocale } from '../actions/archiveActionCreators';
import { changeRegistryEntriesViewMode } from '../actions/searchActionCreators';

import { getInterview } from '../../../lib/utils';

const mapStateToProps = (state) => {
    return {
        visible: state.flyoutTabs.visible,
        archiveId: state.archive.archiveId,
        selectedArchiveIds: state.archive.selectedArchiveIds,
        locale: state.archive.locale,
        locales: state.archive.locales,
        editView: state.archive.editView,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        interview: getInterview(state),
        project: state.archive.project,
        showRegistryEntriesTree: state.search.registryEntries.showRegistryEntriesTree
    }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    setLocale: locale => dispatch(setLocale(locale)),
    changeRegistryEntriesViewMode: bool => dispatch(changeRegistryEntriesViewMode(bool)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FlyoutTabs);
