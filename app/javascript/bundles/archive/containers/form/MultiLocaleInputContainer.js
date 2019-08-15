import { connect } from 'react-redux';

import MultiLocaleInput from '../../components/form/MultiLocaleInput';


const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        locales: state.archive.locales,
        translations: state.archive.translations,
    }
}

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(MultiLocaleInput);
