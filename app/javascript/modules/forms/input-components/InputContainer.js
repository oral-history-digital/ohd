import { connect } from 'react-redux';

import { getLocale, getTranslations } from 'modules/archive';
import Input from './Input';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        translations: getTranslations(state),
    }
}

export default connect(mapStateToProps)(Input);
