import { connect } from 'react-redux';

import {
    getCurrentProject,
    getCurrentInterview,
    getCollectionsForCurrentProject,
} from 'modules/data';
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
