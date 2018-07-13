import { connect } from 'react-redux';
import InterviewInfo from '../components/InterviewInfo';

import { getInterview } from '../../../lib/utils';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        editView: state.archive.editView,
        interview: getInterview(state),
        people: state.data.people,
        account: state.account,

    }
}


export default connect(mapStateToProps)(InterviewInfo);
