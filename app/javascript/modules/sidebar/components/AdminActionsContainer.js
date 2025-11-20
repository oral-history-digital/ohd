import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getIsLoggedIn } from 'modules/user';
import {
    addRemoveArchiveId,
    setArchiveIds,
    getDoiResult,
} from 'modules/archive';
import { getInterviewsStatus } from 'modules/data';
import AdminActions from './AdminActions';

const mapStateToProps = (state) => ({
    statuses: getInterviewsStatus(state),
    doiResult: getDoiResult(state),
    isLoggedIn: getIsLoggedIn(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            addRemoveArchiveId,
            setArchiveIds,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(AdminActions);
