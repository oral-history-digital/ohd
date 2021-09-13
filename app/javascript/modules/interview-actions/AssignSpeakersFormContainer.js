import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getArchiveId, getProjectId, getTranslations } from 'modules/archive';
import { fetchData, submitData, getProjectLocales, getProjects, getCurrentAccount,
    getPeopleForCurrentProject, getPeopleStatus, getSpeakerDesignationsStatus } from 'modules/data';
import AssignSpeakersForm from './AssignSpeakersForm';

const mapStateToProps = state => ({
    locale: getLocale(state),
    locales: getProjectLocales(state),
    archiveId: getArchiveId(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    translations: getTranslations(state),
    account: getCurrentAccount(state),
    people: getPeopleForCurrentProject(state),
    peopleStatus: getPeopleStatus(state),
    speakerDesignationsStatus: getSpeakerDesignationsStatus(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AssignSpeakersForm);
