import { connect } from 'react-redux';

import { getLocale, getTranslations, getProjectId, getEditView } from 'modules/archive';
import { getProjects, getCurrentAccount } from 'modules/data';
import IndexingTabPanel from './IndexingTabPanel';

const mapStateToProps = (state) => ({
    locale: getLocale(state),
    translations: getTranslations(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    account: getCurrentAccount(state),
    editView: getEditView(state),
});

export default connect(mapStateToProps)(IndexingTabPanel);
