import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { changeToInterviewEditView, getInterviewEditView } from 'modules/archive';
import { enableAutoScroll, disableAutoScroll, getAutoScroll } from 'modules/interview';
import MediaPlayerButtons from './MediaPlayerButtons';
import { getCurrentInterview } from 'modules/data';

const mapStateToProps = (state) => ({
    autoScroll: getAutoScroll(state),
    editViewEnabled: !!getInterviewEditView(state),
    interview: getCurrentInterview(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    enableAutoScroll,
    disableAutoScroll,
    changeToInterviewEditView,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MediaPlayerButtons);
