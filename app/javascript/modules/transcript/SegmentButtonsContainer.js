import { connect } from 'react-redux';

import { getWorkbookData } from 'modules/workbook';
import SegmentButtons from './SegmentButtons';

const mapStateToProps = state => ({
    workbookData: getWorkbookData(state),
});

export default connect(mapStateToProps)(SegmentButtons);
