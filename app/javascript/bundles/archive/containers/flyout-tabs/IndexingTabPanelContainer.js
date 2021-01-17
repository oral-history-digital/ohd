import { connect } from 'react-redux';

import IndexingTabPanel from '../../components/flyout-tabs/IndexingTabPanel';

const mapStateToProps = (state) => ({
    locale: state.archive.locale,
    translations: state.archive.translations,
    projectId: state.archive.projectId,
        projects: state.data.projects,
    account: state.data.accounts.current,
    editView: state.archive.editView,
});

export default connect(mapStateToProps)(IndexingTabPanel);
