import { connect } from 'react-redux';

import UserRegistrationSearchForm from '../components/UserRegistrationSearchForm';
import { fetchData } from '../actions/dataActionCreators';
import { 
    resetUserRegistrationQuery, 
    setUserRegistrationQueryParams, 
} from '../actions/searchActionCreators';

const mapStateToProps = (state) => {
    return {
        translations: state.archive.translations,
        locale: state.archive.locale,
        query: state.search.userRegistrations.query,
        userRegistrationsStatus: state.data.statuses.user_registrations,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (dataType, archiveId, nestedDataType, locale, extraParams) => dispatch(fetchData(dataType, archiveId, nestedDataType, locale, extraParams)),
    setUserRegistrationQueryParams: (params) => dispatch(setUserRegistrationQueryParams(params)),
    resetUserRegistrationQuery: () => dispatch(resetUserRegistrationQuery()),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserRegistrationSearchForm);
