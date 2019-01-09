import { connect } from 'react-redux';

import UserRegistrations from '../components/UserRegistrations';
import { fetchData } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        locales: state.archive.locales,
        translations: state.archive.translations,
        userRegistrations: state.data.user_registrations,
        userRegistrationsStatus: state.data.statuses.user_registrations,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (dataType, archiveId, nestedDataType, locale, extraParams) => dispatch(fetchData(dataType, archiveId, nestedDataType, locale, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserRegistrations);
