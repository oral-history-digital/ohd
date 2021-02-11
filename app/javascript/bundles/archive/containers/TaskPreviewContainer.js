import { connect } from 'react-redux';

import TaskPreview from '../components/TaskPreview';
import { setArchiveId } from 'modules/archive';
import { setTapeAndTime } from 'modules/video-player';

const mapStateToProps = (state) => {
    return {
        archiveId: state.archive.archiveId,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        locale: state.archive.locale,
        translations: state.archive.translations,
        account: state.data.accounts.current
    }
}

const mapDispatchToProps = (dispatch) => ({
    setTapeAndTime: (tape, time) => dispatch(setTapeAndTime(tape, time)),
    setArchiveId: (archiveId) => dispatch(setArchiveId(archiveId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TaskPreview);
