import { connect } from 'react-redux';

import { getLocale, getTranslations } from 'modules/archive';
import { getProjectLocales } from 'modules/data';
import MultiLocaleWrapper from './MultiLocaleWrapper';

const mapStateToProps = state => ({
    locale: getLocale(state),
    locales: getProjectLocales(state),
    translations: getTranslations(state),
});

export default connect(mapStateToProps)(MultiLocaleWrapper);
