import { getEditView } from 'modules/archive';
import {
    getCurrentInterview,
    getCurrentUser,
    getIsCatalog,
} from 'modules/data';
import { connect } from 'react-redux';

import InterviewTextMaterials from './InterviewTextMaterials';

const mapStateToProps = (state) => {
    return {
        editView: getEditView(state),
        interview: getCurrentInterview(state),
        isCatalog: getIsCatalog(state),
        // the following is just a trick to force rerender after deletion
        user: getCurrentUser(state),
    };
};

export default connect(mapStateToProps)(InterviewTextMaterials);
