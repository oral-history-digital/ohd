import { connect } from 'react-redux';

import Select from './Select';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations
    }
}

export default connect(mapStateToProps)(Select);
