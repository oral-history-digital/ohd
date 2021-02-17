import { connect } from 'react-redux';

import { getCurrentProject, getCurrentInterview } from 'modules/data';
import InterviewInfo from './InterviewInfo';

const mapStateToProps = state => ({
    locale: state.archive.locale,
    translations: state.archive.translations,
    project: getCurrentProject(state),
    collections: state.data.collections,
    interview: getCurrentInterview(state),
    languages: state.data.languages,
    // the following is just a trick to force rerender after deletion
    contributionsLastModified: state.data.statuses.contributions.lastModified,
});

export default connect(mapStateToProps)(InterviewInfo);
