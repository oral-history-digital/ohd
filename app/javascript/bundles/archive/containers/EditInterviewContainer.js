import { connect } from 'react-redux';

import EditInterview from '../components/EditInterview';
import { returnToForm } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        locales: state.archive.locales,
        translations: state.archive.translations,
        processed: state.data.statuses.interviews.processed, 
        lastModified: state.data.statuses.interviews.lastModified, 
    }
}

const mapDispatchToProps = (dispatch) => ({
    returnToForm: (dataType) => dispatch(returnToForm(dataType))
})

export default connect(mapStateToProps, mapDispatchToProps)(EditInterview);
