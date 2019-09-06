import { connect } from 'react-redux';

import Uploads from '../components/Uploads';
import { submitData } from '../actions/dataActionCreators';
import { getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return { 
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        translations: state.archive.translations,
        uploadTypes: project && project.upload_types,
        account: state.data.accounts.current,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (params) => dispatch(submitData(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Uploads);
