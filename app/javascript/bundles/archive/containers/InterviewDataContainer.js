import { connect } from 'react-redux';
import InterviewData from '../components/InterviewData';

import { getInterview } from '../../../lib/utils';


const mapStateToProps = (state) => {
    return {
        interview: getInterview(state),
        locale: state.archive.locale,
        account: state.data.accounts.current,
        authStatus: state.account,
    }
}


export default connect(mapStateToProps)(InterviewData);
