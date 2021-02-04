import { connect } from 'react-redux';

import { getInterview, getProject } from 'lib/utils';
import InterviewInfo from './InterviewInfo';

const mapStateToProps = state => ({
    locale: state.archive.locale,
    translations: state.archive.translations,
    project: getProject(state),
    collections: state.data.collections,
    interview: getInterview(state),
    languages: state.data.languages,
    // the following is just a trick to force rerender after deletion
    contributionsLastModified: state.data.statuses.contributions.lastModified,
});

export default connect(mapStateToProps)(InterviewInfo);
