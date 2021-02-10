import { connect } from 'react-redux';

import { getProject } from 'lib/utils';
import { getCurrentInterview } from 'modules/data';
import CitationInfo from '../components/CitationInfo';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        interview: getCurrentInterview(state),
        projectDoi: project && project.doi,
        projectName: project && project.name,
        projectDomain: project && project.domain,
        archiveDomain: project && project.archive_domain,
    }
}

export default connect(mapStateToProps)(CitationInfo);
