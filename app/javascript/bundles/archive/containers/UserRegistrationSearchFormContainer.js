import { connect } from 'react-redux';

import UserRegistrationSearchForm from '../components/UserRegistrationSearchForm';
import { 
    resetQuery, 
    setQueryParams, 
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
    searchUserRegistration: (url, query) => dispatch(searchUserRegistration(url, query)),
    setQueryParams: (scope, params) => dispatch(setQueryParams(scope, params)),
    resetQuery: (scope) => dispatch(resetQuery(scope)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserRegistrationSearchForm);
