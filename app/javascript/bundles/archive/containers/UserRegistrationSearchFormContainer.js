import { connect } from 'react-redux';

import UserRegistrationSearchForm from '../components/UserRegistrationSearchForm';
import { 
    resetUserRegistrationQuery, 
    setUserRegistrationQueryParams, 
    searchUserRegistration,
} from '../actions/searchActionCreators';

const mapStateToProps = (state) => {
    return {
        translations: state.archive.translations,
        locale: state.archive.locale,
        query: state.search.userRegistrations.query,
        isUserRegistrationSearching: state.search.isUserRegistrationSearching,
    }
}

const mapDispatchToProps = (dispatch) => ({
    searchUserRegistration: (url) => dispatch(searchUserRegistration(url)),
    setUserRegistrationQueryParams: (params) => dispatch(setUserRegistrationQueryParams(params)),
    resetUserRegistrationQuery: () => dispatch(resetUserRegistrationQuery()),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserRegistrationSearchForm);
