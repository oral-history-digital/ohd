import { connect } from 'react-redux';

import { getLocale, getTranslations } from 'modules/archive';
import Element from './Element';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        translations: getTranslations(state),
    }
}

export default connect(mapStateToProps)(Element);
