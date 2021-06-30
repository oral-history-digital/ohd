import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { openArchivePopup } from 'modules/ui';
import { getCurrentInterview } from 'modules/data';
import Gallery from './Gallery';

const mapStateToProps = state => ({
    interview: getCurrentInterview(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    openArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Gallery);
