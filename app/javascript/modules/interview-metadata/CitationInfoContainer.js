import {
    getCollectionsForCurrentProject,
    getCurrentInterview,
} from 'modules/data';
import { connect } from 'react-redux';

import CitationInfo from './CitationInfo';

const mapStateToProps = (state) => {
    return {
        interview: getCurrentInterview(state),
        collections: getCollectionsForCurrentProject(state),
    };
};

export default connect(mapStateToProps)(CitationInfo);
