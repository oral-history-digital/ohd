import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import InterviewTextMaterials from '../components/InterviewTextMaterials';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { fetchData } from '../actions/dataActionCreators';
import { getCurrentAccount, getCurrentInterview, getCurrentProject } from '../selectors/dataSelectors';
import { getLocale, getProjectId, getTranslations } from '../selectors/archiveSelectors';

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

const mapDispatchToProps = dispatch => bindActionCreators({
    openArchivePopup,
    closeArchivePopup,
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewTextMaterials);
