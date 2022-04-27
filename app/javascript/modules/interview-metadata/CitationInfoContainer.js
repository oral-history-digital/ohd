import { connect } from 'react-redux';

import { getLocale, getProjectId } from 'modules/archive';
import { getCurrentProject, getCurrentInterview, getCollectionsForCurrentProject } from 'modules/data';
import CitationInfo from './CitationInfo';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        project: project,
        projectId: getProjectId(state),
        interview: getCurrentInterview(state),
        collections: getCollectionsForCurrentProject(state),
        projectDoi: project && project.doi,
        projectName: project && project.name,
        archiveDomain: project && project.archive_domain,
    }
};

export default connect(mapStateToProps)(CitationInfo);
