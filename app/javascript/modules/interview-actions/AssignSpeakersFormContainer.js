import { connect } from 'react-redux';

import { fetchData, submitData, getCurrentProject } from 'modules/data';
import AssignSpeakersForm from './AssignSpeakersForm';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        archiveId: state.archive.archiveId,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        people: state.data.people,
        peopleStatus: state.data.statuses.people,
        speakerDesignationsStatus: state.data.statuses.speaker_designations,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    submitData: (props, params) => dispatch(submitData(props, params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AssignSpeakersForm);