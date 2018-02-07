import { connect } from 'react-redux';
import CitationInfo from '../components/CitationInfo';

import ArchiveUtils from '../../../lib/utils';


const mapStateToProps = (state) => {
    let data = ArchiveUtils.getInterview(state);
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        interview: data && data.interview,
        projectName: state.archive.projectName,
        projectDomain: state.archive.projectDomain
    }
}


export default connect(mapStateToProps)(CitationInfo);
