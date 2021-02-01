import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { openArchivePopup, closeArchivePopup } from 'modules/ui';
import { submitData, fetchData, deleteData } from 'bundles/archive/actions/dataActionCreators';
import { getCurrentAccount, getCurrentProject } from 'bundles/archive/selectors/dataSelectors';
import { getLocale, getLocales, getTranslations } from 'bundles/archive/selectors/archiveSelectors';
import PhotoForm from './PhotoForm';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        locales: (project && project.available_locales) || getLocales(state),
        translations: getTranslations(state),
        account: getCurrentAccount(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
    fetchData,
    deleteData,
    openArchivePopup,
    closeArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PhotoForm);
