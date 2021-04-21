import { connect } from 'react-redux';

import { getUserContents } from 'modules/data';
import SegmentButtons from './SegmentButtons';

const mapStateToProps = state => ({
    userContents: getUserContents(state),
});

export default connect(mapStateToProps)(SegmentButtons);
