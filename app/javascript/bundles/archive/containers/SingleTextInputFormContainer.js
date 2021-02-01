import { connect } from 'react-redux';

import SingleTextInputForm from '../components/SingleTextInputForm';
import { closeArchivePopup } from 'modules/ui';
import { getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        translations: state.archive.translations,
    }
}

const mapDispatchToProps = (dispatch) => ({
    closeArchivePopup: () => dispatch(closeArchivePopup()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SingleTextInputForm);
