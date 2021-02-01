import { connect } from 'react-redux';

import Input from './Input';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
    }
}

export default connect(mapStateToProps)(Input);
