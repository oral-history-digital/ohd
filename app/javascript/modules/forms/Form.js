import { connect } from 'react-redux';

import { getLocale, getTranslations } from 'modules/archive';
import FormComponent from './FormComponent';

const mapStateToProps = state => ({
    locale: getLocale(state),
    translations: getTranslations(state),
});

export default connect(mapStateToProps)(FormComponent);
