import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { openArchivePopup } from 'modules/ui';
import Gallery from './Gallery';
import { getCurrentAccount, getCurrentInterview, getCurrentProject } from 'bundles/archive/selectors/dataSelectors';
import { getEditView, getLocale, getTranslations } from 'bundles/archive/selectors/archiveSelectors';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        interview: getCurrentInterview(state),
        translations: getTranslations(state),
        locale: getLocale(state),
        editView: getEditView(state),
        account: getCurrentAccount(state),
        project: project && project.identifier,
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    openArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Gallery);
