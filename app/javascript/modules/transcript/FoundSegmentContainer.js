import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale } from 'modules/archive';
import { sendTimeChangeRequest } from 'modules/media-player';
import FoundSegment from './FoundSegment';

const mapStateToProps = state => ({
    locale: getLocale(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    sendTimeChangeRequest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FoundSegment);
