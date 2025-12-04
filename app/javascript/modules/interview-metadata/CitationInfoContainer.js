import {
    getCollectionsForCurrentProject,
    getCurrentInterview,
    getCurrentProject,
} from 'modules/data';
import { connect } from 'react-redux';

import CitationInfo from './CitationInfo';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        interview: getCurrentInterview(state),
        collections: getCollectionsForCurrentProject(state),
        projectDoi: project && project.doi,
        projectName: project && project.name,
    };
};

export default connect(mapStateToProps)(CitationInfo);
