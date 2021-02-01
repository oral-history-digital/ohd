import { connect } from 'react-redux';

import Textarea from './Textarea';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
    }
}

export default connect(mapStateToProps)(Textarea);
