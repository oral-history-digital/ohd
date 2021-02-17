import { connect } from 'react-redux';

import { getCurrentProject, getCurrentInterview } from 'modules/data';
import CitationInfo from './CitationInfo';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        projectId: state.archive.projectId,
        interview: getCurrentInterview(state),
        projectDoi: project && project.doi,
        projectName: project && project.name,
        archiveDomain: project && project.archive_domain,
    }
};

export default connect(mapStateToProps)(CitationInfo);
