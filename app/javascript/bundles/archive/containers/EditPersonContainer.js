import { connect } from 'react-redux';

import EditPerson from '../components/EditPerson';
import { returnToForm } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        locales: state.archive.locales,
        translations: state.archive.translations,
        processed: state.data.statuses.people.processed, 
        lastModified: state.data.statuses.people.lastModified, 
    }
}

const mapDispatchToProps = (dispatch) => ({
    returnToForm: (dataType) => dispatch(returnToForm(dataType))
})

export default connect(mapStateToProps, mapDispatchToProps)(EditPerson);
