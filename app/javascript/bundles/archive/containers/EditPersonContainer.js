import { connect } from 'react-redux';

import EditPerson from '../components/EditPerson';
import { submitPerson } from '../actions/interviewActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        translations: state.archive.translations,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitPerson: (params) => dispatch(submitPerson(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(EditPerson);
