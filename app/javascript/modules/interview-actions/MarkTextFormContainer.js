import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    submitData,
    getCurrentInterview,
    getMarkTextStatus,
} from 'modules/data';
import { getArchiveId } from 'modules/archive';
import MarkTextForm from './MarkTextForm';

const mapStateToProps = (state) => {
    return {
        archiveId: getArchiveId(state),
        interview: getCurrentInterview(state),
        markTextStatus: getMarkTextStatus(state),
    };
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            submitData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(MarkTextForm);
