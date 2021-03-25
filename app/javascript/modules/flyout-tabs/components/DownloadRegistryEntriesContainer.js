import { connect } from 'react-redux';

import { getProjects } from 'modules/data';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import DownloadRegistryEntries from './DownloadRegistryEntries';

const mapStateToProps = (state) => ({
    projectId: getProjectId(state),
    projects: getProjects(state),
    locale: getLocale(state),
    translations: getTranslations(state),
});

export default connect(mapStateToProps)(DownloadRegistryEntries);
