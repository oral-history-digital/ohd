import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { openArchivePopup, closeArchivePopup } from 'modules/ui';
import { submitData, fetchData, deleteData } from 'modules/data';
import { getCurrentAccount, getCurrentProject } from 'modules/data';
import { getLocale, getLocales, getTranslations } from 'modules/archive';
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
