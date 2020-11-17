import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import InterviewData from '../components/InterviewData';
import { getInterview } from '../../../lib/utils';

const mapStateToProps = (state) => {
    return {
        interview: getInterview(state),
        locale: state.archive.locale,
        account: state.data.accounts.current,
        isLoggedIn: state.account.isLoggedIn,
    };
};

export default withRouter(connect(
    mapStateToProps
)(InterviewData));
