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
        project: state.archive.project,
        projectDoi: state.archive.projectDoi,
        projectName: state.archive.projectName,
        archiveDomain: state.archive.archiveDomain,
        projectDomain: state.archive.projectDomain
    }
}


export default connect(mapStateToProps)(CitationInfo);
