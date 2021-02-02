import { connect } from 'react-redux';

import UserContent from '../components/UserContent';
import { openArchivePopup } from 'modules/ui';
import { setArchiveId } from 'modules/archive';
import { searchInArchive } from 'modules/search';
import { setTapeAndTime } from 'modules/interview';
import { hideFlyoutTabs } from 'modules/flyout-tabs';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        translations: state.archive.translations,
        facets: state.search.archive.facets,
        editView: state.archive.editView
    }
}

const mapDispatchToProps = (dispatch) => ({
    setTapeAndTime: (tape, time) => dispatch(setTapeAndTime(tape, time)),
    searchInArchive: (url, query) => dispatch(searchInArchive(url, query)),
    setArchiveId: (archiveId) => dispatch(setArchiveId(archiveId)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    hideFlyoutTabs: () => dispatch(hideFlyoutTabs()),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserContent);
