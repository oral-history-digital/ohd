import { connect } from 'react-redux';

import { getEditView } from 'modules/archive';
import { getCurrentUser, getCurrentInterview, getIsCatalog } from 'modules/data';
import InterviewTextMaterials from './InterviewTextMaterials';

const mapStateToProps = (state) => {
    return {
        editView: getEditView(state),
        interview: getCurrentInterview(state),
        isCatalog: getIsCatalog(state),
        // the following is just a trick to force rerender after deletion
        user: getCurrentUser(state),
    }
}

export default connect(mapStateToProps)(InterviewTextMaterials);
