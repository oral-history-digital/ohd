import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { sendTimeChangeRequest } from 'modules/media-player';
import { getCurrentInterview } from 'modules/data';
import Segment from './Segment';

const mapStateToProps = state => ({
    translations: state.archive.translations,
    projectId: state.archive.projectId,
    projects: state.data.projects,
    locale: state.archive.locale,
    interview: getCurrentInterview(state),
    userContents: state.data.user_contents,
    statuses: state.data.statuses.segments,
    account: state.data.accounts.current,
    editView: state.archive.editView,
    people: state.data.people,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    sendTimeChangeRequest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Segment);
