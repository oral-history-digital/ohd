import { connect } from 'react-redux';
import PersonData from '../components/PersonData';

import ArchiveUtils from '../../../lib/utils';


const mapStateToProps = (state) => {
    let data = ArchiveUtils.getInterview(state);
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        interviewee: data && data.interview.interviewees[0],
        interview: data && data.interview,
    }
}


export default connect(mapStateToProps)(PersonData);
