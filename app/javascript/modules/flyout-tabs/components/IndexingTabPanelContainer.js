import { connect } from 'react-redux';

import { getLocale, getTranslations, getProjectId, getEditView } from 'modules/archive';
import IndexingTabPanel from './IndexingTabPanel';

const mapStateToProps = (state) => ({
    locale: getLocale(state),
    translations: getTranslations(state),
    projectId: getProjectId(state),
    projects: state.data.projects,
    account: state.data.accounts.current,
    editView: getEditView(state),
});

export default connect(mapStateToProps)(IndexingTabPanel);
