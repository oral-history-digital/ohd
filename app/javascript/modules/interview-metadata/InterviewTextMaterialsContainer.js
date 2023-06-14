import { connect } from 'react-redux';

import { getCurrentUser, getCurrentInterview, getIsCatalog } from 'modules/data';
import InterviewTextMaterials from './InterviewTextMaterials';

const mapStateToProps = (state) => {
    return {
        interview: getCurrentInterview(state),
        // the following is just a trick to force rerender after deletion
        user: getCurrentUser(state),
        isCatalog: getIsCatalog(state),
    }
}

export default connect(mapStateToProps)(InterviewTextMaterials);
