import { connect } from 'react-redux';

import InterviewTextMaterials from '../components/InterviewTextMaterials';
import { getCurrentAccount, getCurrentInterview, getCurrentProject } from 'modules/data';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        translations: getTranslations(state),
        projectId: getProjectId(state),
        interview: getCurrentInterview(state),
        project: getCurrentProject(state),
        // the following is just a trick to force rerender after deletion
        account: getCurrentAccount(state),
    }
}

export default connect(mapStateToProps)(InterviewTextMaterials);
