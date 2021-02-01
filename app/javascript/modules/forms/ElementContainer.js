import { connect } from 'react-redux';

import Element from './Element';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
    }
}

export default connect(mapStateToProps)(Element);
