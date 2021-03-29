import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getTranslations, getProjectId, getEditView } from 'modules/archive';
import { sendTimeChangeRequest } from 'modules/media-player';
import { getCurrentInterview, getProjects, getUserContents, getCurrentAccount, getPeople, getSegmentsStatus } from 'modules/data';
import Segment from './Segment';

const mapStateToProps = state => ({
    translations: getTranslations(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    locale: getLocale(state),
    interview: getCurrentInterview(state),
    userContents: getUserContents(state),
    statuses: getSegmentsStatus(state),
    account: getCurrentAccount(state),
    editView: getEditView(state),
    people: getPeople(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    sendTimeChangeRequest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Segment);
