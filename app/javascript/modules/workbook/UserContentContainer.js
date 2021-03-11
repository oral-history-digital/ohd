import { connect } from 'react-redux';

import { setArchiveId } from 'modules/archive';
import { searchInArchive } from 'modules/search';
import { setTapeAndTime } from 'modules/media-player';
import { hideFlyoutTabs } from 'modules/flyout-tabs';
import UserContent from './UserContent';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        translations: state.archive.translations,
        editView: state.archive.editView
    }
}

const mapDispatchToProps = (dispatch) => ({
    setTapeAndTime: (tape, time) => dispatch(setTapeAndTime(tape, time)),
    searchInArchive: (url, query) => dispatch(searchInArchive(url, query)),
    setArchiveId: (archiveId) => dispatch(setArchiveId(archiveId)),
    hideFlyoutTabs: () => dispatch(hideFlyoutTabs()),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserContent);
