import { connect } from 'react-redux';
import PersonData from '../components/PersonData';

import ArchiveUtils from '../../../lib/utils';


const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        archiveId: state.archive.archiveId,
        name: ArchiveUtils.getInterview(state).interview.short_title[state.locale],
        interviewee: ArchiveUtils.getInterview(state).interview.interviewees[0]
    }
}


export default connect(mapStateToProps)(PersonData);