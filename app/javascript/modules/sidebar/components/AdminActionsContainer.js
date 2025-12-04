import {
    addRemoveArchiveId,
    getDoiResult,
    setArchiveIds,
} from 'modules/archive';
import { getInterviewsStatus } from 'modules/data';
import { getIsLoggedIn } from 'modules/user';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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
