import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { openArchivePopup, closeArchivePopup } from 'modules/ui';
import { deleteData } from 'bundles/archive/actions/dataActionCreators';
import { getCurrentAccount, getCurrentInterview, getCurrentProject } from 'bundles/archive/selectors/dataSelectors';
import { getArchiveId, getEditView, getLocale, getTranslations } from 'bundles/archive/selectors/archiveSelectors';
import Carousel from './Carousel';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        archiveId: getArchiveId(state),
        editView: getEditView(state),
        translations: getTranslations(state),
        account: getCurrentAccount(state),
        interview: getCurrentInterview(state),
        project: project && project.identifier,
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    deleteData,
    openArchivePopup,
    closeArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Carousel);
