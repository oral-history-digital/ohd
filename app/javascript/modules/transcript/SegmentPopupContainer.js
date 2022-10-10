import { connect } from 'react-redux';

import { getWorkbookAnnotations } from 'modules/workbook';
import { getCurrentProject } from 'modules/data';
import SegmentPopup from './SegmentPopup';

const mapStateToProps = state => ({
    workbookAnnotations: getWorkbookAnnotations(state),
    project: getCurrentProject(state),
});

export default connect(mapStateToProps)(SegmentPopup);
