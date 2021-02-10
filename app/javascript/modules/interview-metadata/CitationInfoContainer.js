import { connect } from 'react-redux';

import { getProject } from 'lib/utils';
import { getCurrentInterview } from 'modules/data';
import CitationInfo from './CitationInfo';

const mapStateToProps = (state) => {
    let project = getProject(state);
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
