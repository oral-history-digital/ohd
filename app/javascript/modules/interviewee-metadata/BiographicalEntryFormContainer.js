import { connect } from 'react-redux';

import { submitData } from 'modules/data';
import { closeArchivePopup } from 'modules/ui';
import BiographicalEntryForm from './BiographicalEntryForm';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        translations: state.archive.translations,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(BiographicalEntryForm);
