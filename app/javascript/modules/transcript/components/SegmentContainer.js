import { getEditView } from 'modules/archive';
import { getAutoScroll } from 'modules/interview';
import { sendTimeChangeRequest } from 'modules/media-player';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Segment from './Segment';

const mapStateToProps = (state) => ({
    autoScroll: getAutoScroll(state),
    editView: getEditView(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            sendTimeChangeRequest,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(Segment);
