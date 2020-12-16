import { connect } from 'react-redux';

import ArchivePopupButton from '../components/ArchivePopupButton';
import { openArchivePopup } from '../actions/archivePopupActionCreators';
import { getProject } from 'lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return { 
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        translations: state.archive.translations,
    }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArchivePopupButton);
