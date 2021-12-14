import { connect } from 'react-redux';

import { getLocale, getTranslations } from 'modules/archive';
import DataDetails from './DataDetails';

const mapStateToProps = state => ({
    locale: getLocale(state),
    translations: getTranslations(state),
});

export default connect(mapStateToProps)(DataDetails);
