import { connect } from 'react-redux';
import CitationInfo from '../components/CitationInfo';

import { getInterview } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let interview = getInterview(state);
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        interview: interview,
        people: state.data.people,
        contributionTypes: state.archive.contributionTypes,
        project: state.archive.project,
        projectDoi: state.archive.projectDoi,
        projectName: state.archive.projectName,
        archiveDomain: state.archive.archiveDomain,
        projectDomain: state.archive.projectDomain
    }
}

export default connect(mapStateToProps)(CitationInfo);
