import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { openArchivePopup } from 'modules/ui';
import { getCurrentInterview, getCurrentAccount } from 'bundles/archive/selectors/dataSelectors';
import { getEditView, getLocale, getTranslations } from 'bundles/archive/selectors/archiveSelectors';
import Photo from './Photo';

const mapStateToProps = state => ({
    interview: getCurrentInterview(state),
    translations: getTranslations(state),
    locale: getLocale(state),
    editView: getEditView(state),
    account: getCurrentAccount(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    openArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Photo);
