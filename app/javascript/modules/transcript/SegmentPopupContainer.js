import { connect } from 'react-redux';

import { getUserContents } from 'modules/data';
import SegmentPopup from './SegmentPopup';

const mapStateToProps = state => ({
    userContents: getUserContents(state),
});

export default connect(mapStateToProps)(SegmentPopup);
