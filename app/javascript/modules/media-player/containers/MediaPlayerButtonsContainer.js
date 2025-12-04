import {
    changeToInterviewEditView,
    getInterviewEditView,
} from 'modules/archive';
import { getCurrentInterview } from 'modules/data';
import {
    disableAutoScroll,
    enableAutoScroll,
    getAutoScroll,
} from 'modules/interview';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MediaPlayerButtons from '../components/MediaPlayerButtons';

const mapStateToProps = (state) => ({
    autoScroll: getAutoScroll(state),
    editViewEnabled: !!getInterviewEditView(state),
    interview: getCurrentInterview(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            enableAutoScroll,
            disableAutoScroll,
            changeToInterviewEditView,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(MediaPlayerButtons);
