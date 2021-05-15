import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { openArchivePopup } from 'modules/ui';
import { getCurrentAccount, getCurrentProject, getCurrentInterview } from 'modules/data';
import { getEditView, getLocale, getTranslations } from 'modules/archive';
import Gallery from './Gallery';

const mapStateToProps = state => ({
    interview: getCurrentInterview(state),
    locale: getLocale(state),
    translations: getTranslations(state),
    editView: getEditView(state),
    account: getCurrentAccount(state),
    project: getCurrentProject(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    openArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Gallery);
