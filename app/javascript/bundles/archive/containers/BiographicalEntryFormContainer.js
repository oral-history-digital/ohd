import { connect } from 'react-redux';

import BiographicalEntryForm from '../components/BiographicalEntryForm';
import { submitData } from '../actions/dataActionCreators';
import { closeArchivePopup } from 'modules/ui';

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
