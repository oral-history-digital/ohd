import { connect } from 'react-redux';

import ErrorBoundaryComponent from './ErrorBoundaryComponent';

const mapStateToProps = (state) => ({
    locale: state.archive.locale,
    translations: state.archive.translations,
});

export default connect(mapStateToProps)(ErrorBoundaryComponent);
