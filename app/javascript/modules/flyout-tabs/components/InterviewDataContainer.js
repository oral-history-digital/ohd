import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getLocale } from 'modules/archive';
import { getIsLoggedIn } from 'modules/account';
import InterviewData from './InterviewData';

const mapStateToProps = state => ({
    locale: getLocale(state),
    isLoggedIn: getIsLoggedIn(state),
});

export default withRouter(connect(
    mapStateToProps
)(InterviewData));
