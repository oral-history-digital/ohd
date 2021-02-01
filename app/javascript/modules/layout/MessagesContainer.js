import { connect } from 'react-redux';

import Messages from './Messages';

const mapStateToProps = (state) => ({
    locale: state.archive.locale,
    translations: state.archive.translations,
});

export default connect(mapStateToProps)(Messages);
