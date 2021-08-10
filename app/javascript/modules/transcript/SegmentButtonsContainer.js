import { connect } from 'react-redux';

import { getWorkbookAnnotations } from 'modules/workbook';
import SegmentButtons from './SegmentButtons';

const mapStateToProps = state => ({
    workbookAnnotations: getWorkbookAnnotations(state),
});

export default connect(mapStateToProps)(SegmentButtons);
