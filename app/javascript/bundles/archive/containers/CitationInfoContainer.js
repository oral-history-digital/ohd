import { connect } from 'react-redux';
import CitationInfo from '../components/CitationInfo';

import { getInterview, getProject } from 'lib/utils';

const mapStateToProps = (state) => {
    let interview = getInterview(state);
    let project = getProject(state);
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        interview: interview,
        projectDoi: project && project.doi,
        projectName: project && project.name,
        projectDomain: project && project.domain,
        archiveDomain: project && project.archive_domain,
    }
}

export default connect(mapStateToProps)(CitationInfo);
