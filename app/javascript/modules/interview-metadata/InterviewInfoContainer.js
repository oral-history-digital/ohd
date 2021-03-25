import { connect } from 'react-redux';

import { getLocale, getTranslations } from 'modules/archive';
import { getCurrentProject, getCurrentInterview, getCollections, getLanguages } from 'modules/data';
import InterviewInfo from './InterviewInfo';

const mapStateToProps = state => ({
    locale: getLocale(state),
    translations: getTranslations(state),
    project: getCurrentProject(state),
    collections: getCollections(state),
    interview: getCurrentInterview(state),
    languages: getLanguages(state),
    // the following is just a trick to force rerender after deletion
    contributionsLastModified: state.data.statuses.contributions.lastModified,
});

export default connect(mapStateToProps)(InterviewInfo);
