import { connect } from 'react-redux';

import { getEditView, getLocale, getTranslations } from 'modules/archive';
import { getCurrentAccount, getCurrentProject, getCurrentInterview, getCurrentInterviewee } from 'modules/data';
import BiographicalEntries from './BiographicalEntries';

const mapStateToProps = state => ({
    interview: getCurrentInterview(state),
    person: getCurrentInterviewee(state),
    locale: getLocale(state),
    translations: getTranslations(state),
    account: getCurrentAccount(state),
    editView: getEditView(state),
    project: getCurrentProject(state),
});

export default connect(mapStateToProps)(BiographicalEntries);
