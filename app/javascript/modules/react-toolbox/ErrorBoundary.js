import { connect } from 'react-redux';

import { getLocale, getTranslations } from 'modules/archive';
import ErrorBoundaryComponent from './ErrorBoundaryComponent';

const mapStateToProps = (state) => ({
    locale: getLocale(state),
    translations: getTranslations(state),
});

export default connect(mapStateToProps)(ErrorBoundaryComponent);
