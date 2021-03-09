import { connect } from 'react-redux';

import { submitData, deleteData, getProjects } from 'modules/data';
import { getLocale, getArchiveId, getProjectId } from 'modules/archive';
import Contribution from './Contribution';

const mapStateToProps = state => ({
    archiveId: getArchiveId(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
});

const mapDispatchToProps = (dispatch) => ({
    deleteData: (props, dataType, id, nestedDataType, nestedId, skipRemove) => dispatch(deleteData(props, dataType, id, nestedDataType, nestedId, skipRemove)),
    submitData: (props, params) => dispatch(submitData(props, params))
})

export default connect(mapStateToProps, mapDispatchToProps)(Contribution);
