import { connect } from 'react-redux';

import { getLocale, getLocales, getArchiveId, getProjectId, getTranslations } from 'modules/archive';
import { fetchData, submitData, getCurrentProject, getProjects, getCurrentAccount, getPeople,
    getPeopleStatus, getSpeakerDesignationsStatus } from 'modules/data';
import AssignSpeakersForm from './AssignSpeakersForm';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        locales: (project && project.available_locales) || getLocales(state),
        archiveId: getArchiveId(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        translations: getTranslations(state),
        account: getCurrentAccount(state),
        people: getPeople(state),
        peopleStatus: getPeopleStatus(state),
        speakerDesignationsStatus: getSpeakerDesignationsStatus(state),
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    submitData: (props, params) => dispatch(submitData(props, params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AssignSpeakersForm);
