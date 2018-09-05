import { connect } from 'react-redux';

import Uploads from '../components/Uploads';
import { submitData } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        locales: state.archive.locales,
        translations: state.archive.translations,
        uploadTypes: state.archive.uploadTypes,
        account: state.account,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (params) => dispatch(submitData(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(Uploads);
