import { connect } from 'react-redux';

import UserRegistrations from '../components/UserRegistrations';
import { 
    searchUserRegistration,
    setUserRegistrationQueryParams, 
} from '../actions/searchActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        locales: state.archive.locales,
        translations: state.archive.translations,
        userRegistrations: state.search.userRegistrations.results,
        query: state.search.userRegistrations.query,
        isUserRegistrationSearching: state.search.isUserRegistrationSearching,
        resultPagesCount: state.search.userRegistrations.resultPagesCount,
    }
}

const mapDispatchToProps = (dispatch) => ({
    searchUserRegistration: (url, query) => dispatch(searchUserRegistration(url, query)),
    setUserRegistrationQueryParams: (params) => dispatch(setUserRegistrationQueryParams(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserRegistrations);
