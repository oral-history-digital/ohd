import { connect } from 'react-redux';

import ActivateAccount from '../components/ActivateAccount';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        translations: state.archive.translations,
        registrationStatus: state.account.registration_status,
    }
}

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(ActivateAccount);
