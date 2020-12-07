import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import InterviewData from '../components/InterviewData';
import { getLocale } from '../selectors/archiveSelectors';

const mapStateToProps = state => ({
    locale: getLocale(state),
    isLoggedIn: state.account.isLoggedIn,
});

export default withRouter(connect(
    mapStateToProps
)(InterviewData));
