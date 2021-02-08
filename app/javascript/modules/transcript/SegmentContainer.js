import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { openArchivePopup } from 'modules/ui';
import { getInterview } from 'lib/utils';
import { handleSegmentClick } from 'modules/interview';
import Segment from './Segment';

const mapStateToProps = state => ({
    translations: state.archive.translations,
    projectId: state.archive.projectId,
    projects: state.data.projects,
    locale: state.archive.locale,
    interview: getInterview(state),
    userContents: state.data.user_contents,
    statuses: state.data.statuses.segments,
    account: state.data.accounts.current,
    editView: state.archive.editView,
    people: state.data.people,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    handleSegmentClick,
    openArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Segment);
