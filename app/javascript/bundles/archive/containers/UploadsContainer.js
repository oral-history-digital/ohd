import { connect } from 'react-redux';

import Uploads from '../components/Uploads';
import { submitData, returnToForm } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        locales: state.archive.locales,
        translations: state.archive.translations,
        uploadTypes: state.archive.uploadTypes,
        account: state.account,
        processing: state.data.statuses.uploads.processing, 
        lastModified: state.data.statuses.uploads.lastModified, 
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (params) => dispatch(submitData(params)),
    returnToForm: (dataType) => dispatch(returnToForm(dataType))
})

export default connect(mapStateToProps, mapDispatchToProps)(Uploads);
