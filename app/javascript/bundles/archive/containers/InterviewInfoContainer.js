import { connect } from 'react-redux';

import InterviewInfo from '../components/InterviewInfo';
import { getInterview, getProject } from 'lib/utils';

const mapStateToProps = state => ({
    locale: state.archive.locale,
    translations: state.archive.translations,
    project: getProject(state),
    collections: state.data.collections,
    interview: getInterview(state),
    collections: state.data.collections,
    languages: state.data.languages,
    // the following is just a trick to force rerender after deletion
    contributionsLastModified: state.data.statuses.contributions.lastModified,
});

export default connect(mapStateToProps)(InterviewInfo);
