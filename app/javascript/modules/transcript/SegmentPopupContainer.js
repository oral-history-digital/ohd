import { connect } from 'react-redux';

import { getWorkbookAnnotations } from 'modules/workbook';
import SegmentPopup from './SegmentPopup';

const mapStateToProps = state => ({
    workbookAnnotations: getWorkbookAnnotations(state),
});

export default connect(mapStateToProps)(SegmentPopup);
