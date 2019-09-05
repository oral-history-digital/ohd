import { connect } from 'react-redux';
import CitationInfo from '../components/CitationInfo';

import { getInterview, getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let interview = getInterview(state);
    let project = getProject(state);
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        interview: interview,
        project: project && project.identifier,
        projectDoi: state.archive.projectDoi,
        projectName: state.archive.projectName,
        archiveDomain: state.archive.archiveDomain,
        projectDomain: state.archive.projectDomain
    }
}

export default connect(mapStateToProps)(CitationInfo);
