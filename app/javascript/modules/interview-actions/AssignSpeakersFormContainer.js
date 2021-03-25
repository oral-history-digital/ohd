import { connect } from 'react-redux';

import { getLocale, getLocales, getArchiveId, getProjectId, getTranslations } from 'modules/archive';
import { fetchData, submitData, getCurrentProject } from 'modules/data';
import AssignSpeakersForm from './AssignSpeakersForm';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        locales: (project && project.available_locales) || getLocales(state),
        archiveId: getArchiveId(state),
        projectId: getProjectId(state),
        projects: state.data.projects,
        translations: getTranslations(state),
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
