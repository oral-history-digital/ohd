import { connect } from 'react-redux';

import DownloadRegistryEntries from '../../components/flyout-tabs/DownloadRegistryEntries';

const mapStateToProps = (state) => ({
    projectId: state.archive.projectId,
        projects: state.data.projects,
    locale: state.archive.locale,
    translations: state.archive.translations,
});

export default connect(mapStateToProps)(DownloadRegistryEntries);
