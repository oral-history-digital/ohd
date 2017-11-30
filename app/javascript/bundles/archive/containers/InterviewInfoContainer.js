import { connect } from 'react-redux';
import InterviewInfo from '../components/InterviewInfo';

import ArchiveUtils from '../../../lib/utils';


const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        interview: ArchiveUtils.getInterview(state).interview
    }
}


export default connect(mapStateToProps)(InterviewInfo);