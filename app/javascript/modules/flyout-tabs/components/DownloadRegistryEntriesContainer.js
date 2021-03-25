import { connect } from 'react-redux';

import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import DownloadRegistryEntries from './DownloadRegistryEntries';

const mapStateToProps = (state) => ({
    projectId: getProjectId(state),
    projects: state.data.projects,
    locale: getLocale(state),
    translations: getTranslations(state),
});

export default connect(mapStateToProps)(DownloadRegistryEntries);
