import { connect } from 'react-redux';

import TaskPreview from '../components/TaskPreview';
import { setArchiveId } from '../actions/archiveActionCreators';
import { setTapeAndTime } from '../actions/interviewActionCreators';

const mapStateToProps = (state) => {
    return { 
        archiveId: state.archive.archiveId,
        projectId: state.archive.projectId,
        locale: state.archive.locale,
        translations: state.archive.translations,
    }
}

const mapDispatchToProps = (dispatch) => ({
    setTapeAndTime: (tape, time) => dispatch(setTapeAndTime(tape, time)),
    setArchiveId: (archiveId) => dispatch(setArchiveId(archiveId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TaskPreview);
