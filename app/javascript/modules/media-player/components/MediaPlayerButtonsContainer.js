import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { changeToInterviewEditView, getInterviewEditView } from 'modules/archive';
import { enableAutoScroll, disableAutoScroll, getAutoScroll } from 'modules/interview';
import MediaPlayerButtons from './MediaPlayerButtons';

const mapStateToProps = (state) => ({
    autoScroll: getAutoScroll(state),
    editViewEnabled: !!getInterviewEditView(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    enableAutoScroll,
    disableAutoScroll,
    changeToInterviewEditView,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MediaPlayerButtons);
