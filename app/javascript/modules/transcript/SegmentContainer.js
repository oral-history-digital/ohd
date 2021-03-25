import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getTranslations, getProjectId, getEditView } from 'modules/archive';
import { sendTimeChangeRequest } from 'modules/media-player';
import { getCurrentInterview } from 'modules/data';
import Segment from './Segment';

const mapStateToProps = state => ({
    translations: getTranslations(state),
    projectId: getProjectId(state),
    projects: state.data.projects,
    locale: getLocale(state),
    interview: getCurrentInterview(state),
    userContents: state.data.user_contents,
    statuses: state.data.statuses.segments,
    account: state.data.accounts.current,
    editView: getEditView(state),
    people: state.data.people,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    sendTimeChangeRequest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Segment);
