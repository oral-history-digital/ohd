import { connect } from 'react-redux';

import { getLocale } from 'modules/archive';
import { getIsLoggedIn } from 'modules/account';
import InterviewData from './InterviewData';

const mapStateToProps = state => ({
    locale: getLocale(state),
    isLoggedIn: getIsLoggedIn(state),
});

export default connect(mapStateToProps)(InterviewData);
