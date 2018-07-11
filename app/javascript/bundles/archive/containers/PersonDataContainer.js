import { connect } from 'react-redux';
import PersonData from '../components/PersonData';
import { getInterview } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let interview = getInterview(state);
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        editView: state.archive.editView,
        interview: interview,
        interviewee: interview && interview.interviewees[0],
        account: state.account,
    }
}


export default connect(mapStateToProps)(PersonData);
