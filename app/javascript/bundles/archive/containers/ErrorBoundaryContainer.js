import { connect } from 'react-redux';

import ErrorBoundary from '../components/ErrorBoundary';

const mapStateToProps = (state) => ({
    locale: state.archive.locale,
    translations: state.archive.translations,
});

export default connect(mapStateToProps)(ErrorBoundary);
