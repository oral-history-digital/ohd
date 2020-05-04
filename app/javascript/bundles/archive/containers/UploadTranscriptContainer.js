import { connect } from 'react-redux';

import UploadTranscript from '../components/UploadTranscript';
import { submitData } from '../actions/dataActionCreators';
import { getProject, getInterview } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return { 
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        locales: (project && project.available_locales) || state.archive.locales,
        interview: getInterview(state),
        archiveId: state.archive.archiveId,
        translations: state.archive.translations,
        collections: state.data.collections,
        languages: state.data.languages,
        account: state.data.accounts.current,
        people: state.data.people,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UploadTranscript);
