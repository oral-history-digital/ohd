import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setArchiveId } from 'modules/archive';
import { searchInArchive } from 'modules/search';
import { sendTimeChangeRequest } from 'modules/media-player';
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

const mapDispatchToProps = dispatch => bindActionCreators({
    sendTimeChangeRequest,
    searchInArchive,
    setArchiveId,
    hideFlyoutTabs,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserContent);
