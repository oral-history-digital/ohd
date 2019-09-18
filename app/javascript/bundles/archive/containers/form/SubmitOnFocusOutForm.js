import { connect } from 'react-redux';

import SubmitOnFocusOutForm from '../../components/form/SubmitOnFocusOutForm';
import { submitData } from '../../actions/dataActionCreators';

const mapStateToProps = (state) => {
    //let project = getProject(state);
    return {
        locale: state.archive.locale,
        //locales: (project && project.locales) || state.archive.locales,
        translations: state.archive.translations,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SubmitOnFocusOutForm);
