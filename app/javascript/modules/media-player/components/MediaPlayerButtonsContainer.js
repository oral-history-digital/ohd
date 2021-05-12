import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { enableAutoScroll, disableAutoScroll, getAutoScroll } from 'modules/interview';
import MediaPlayerButtons from './MediaPlayerButtons';

const mapStateToProps = (state) => ({
    autoScroll: getAutoScroll(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    enableAutoScroll,
    disableAutoScroll,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MediaPlayerButtons);
