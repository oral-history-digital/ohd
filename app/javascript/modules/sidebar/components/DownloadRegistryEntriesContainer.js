import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import { getProjects } from 'modules/data';
import { connect } from 'react-redux';

import DownloadRegistryEntries from './DownloadRegistryEntries';

const mapStateToProps = (state) => ({
    projectId: getProjectId(state),
    projects: getProjects(state),
    locale: getLocale(state),
    translations: getTranslations(state),
});

export default connect(mapStateToProps)(DownloadRegistryEntries);
