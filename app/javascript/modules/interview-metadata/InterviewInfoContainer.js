import { connect } from 'react-redux';

import { getProject } from 'lib/utils';
import InterviewInfo from './InterviewInfo';
import { getCurrentInterview } from 'modules/data';

const mapStateToProps = state => ({
    locale: state.archive.locale,
    translations: state.archive.translations,
    project: getProject(state),
    collections: state.data.collections,
    interview: getCurrentInterview(state),
    languages: state.data.languages,
    // the following is just a trick to force rerender after deletion
    contributionsLastModified: state.data.statuses.contributions.lastModified,
});

export default connect(mapStateToProps)(InterviewInfo);
