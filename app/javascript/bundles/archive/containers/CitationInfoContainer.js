import { connect } from 'react-redux';
import CitationInfo from '../components/CitationInfo';

import { getInterview } from '../../../lib/utils';


const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        interview: getInterview(state),
        project: state.archive.project,
        projectDoi: state.archive.projectDoi,
        projectName: state.archive.projectName,
        archiveDomain: state.archive.archiveDomain,
        projectDomain: state.archive.projectDomain
    }
}


export default connect(mapStateToProps)(CitationInfo);
