import { connect } from 'react-redux';

import { getWorkbookData } from 'modules/workbook';
import SegmentPopup from './SegmentPopup';

const mapStateToProps = state => ({
    workbookData: getWorkbookData(state),
});

export default connect(mapStateToProps)(SegmentPopup);
