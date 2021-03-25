import { connect } from 'react-redux';

import { getLocale, getTranslations } from 'modules/archive';
import { getCurrentProject, getCurrentInterview } from 'modules/data';
import InterviewInfo from './InterviewInfo';

const mapStateToProps = state => ({
    locale: getLocale(state),
    translations: getTranslations(state),
    project: getCurrentProject(state),
    collections: state.data.collections,
    interview: getCurrentInterview(state),
    languages: state.data.languages,
    // the following is just a trick to force rerender after deletion
    contributionsLastModified: state.data.statuses.contributions.lastModified,
});

export default connect(mapStateToProps)(InterviewInfo);
