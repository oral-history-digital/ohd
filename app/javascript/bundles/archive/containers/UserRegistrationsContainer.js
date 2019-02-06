import { connect } from 'react-redux';

import UserRegistrations from '../components/UserRegistrations';
import { 
    setQueryParams, 
} from '../actions/searchActionCreators';
import { fetchData } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        locales: state.archive.locales,
        translations: state.archive.translations,
        userRegistrations: state.data.user_registrations,
        resultPagesCount: state.data.statuses.user_registrations.resultPagesCount,
        query: state.search.user_registrations.query,
        isUserRegistrationSearching: state.search.isUserRegistrationSearching,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (dataType, id, nestedDataType, locale, extraParams) => dispatch(fetchData(dataType, id, nestedDataType, locale, extraParams)),
    setQueryParams: (scope, params) => dispatch(setQueryParams(scope, params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserRegistrations);
