import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { sendTimeChangeRequest } from 'modules/media-player';
import { getCurrentInterview } from 'modules/data';
import { getLocale } from 'modules/archive';
import RefTreeEntry from './RefTreeEntry';

const mapStateToProps = state => ({
    locale: getLocale(state),
    interview: getCurrentInterview(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    sendTimeChangeRequest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RefTreeEntry);
