import { getArchiveId } from 'modules/archive';
import { submitData } from 'modules/data';
import { getCurrentInterview } from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import UploadEditTable from './UploadEditTable';

const mapStateToProps = (state) => ({
    interview: getCurrentInterview(state),
    archiveId: getArchiveId(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            submitData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(UploadEditTable);
