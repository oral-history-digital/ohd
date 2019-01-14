import { connect } from 'react-redux';

import UserRegistrations from '../components/UserRegistrations';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        locales: state.archive.locales,
        translations: state.archive.translations,
        userRegistrations: state.data.user_registrations,
    }
}

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(UserRegistrations);
