import { connect } from 'react-redux';

import ProjectConfigTabPanel from './ProjectConfigTabPanel';

const mapStateToProps = (state) => ({
    countryKeys: state.archive.countryKeys,
    locale: state.archive.locale,
    translations: state.archive.translations,
    projectId: state.archive.projectId,
    projects: state.data.projects,
    account: state.data.accounts.current,
    editView: state.archive.editView,
});

export default connect(mapStateToProps)(ProjectConfigTabPanel);