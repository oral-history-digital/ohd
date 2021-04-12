import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { openArchivePopup, closeArchivePopup } from 'modules/ui';
import { deleteData, getProjects } from 'modules/data';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import Data from './Data';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        translations: getTranslations(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    deleteData,
    openArchivePopup,
    closeArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Data);
