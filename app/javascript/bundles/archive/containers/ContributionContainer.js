import { connect } from 'react-redux';

import Contribution from '../components/Contribution';
import { openArchivePopup, closeArchivePopup } from 'modules/ui';
import { deleteData, submitData } from 'modules/data';
import { getLocale, getArchiveId, getProjectId } from 'modules/archive';

const mapStateToProps = state => ({
    archiveId: getArchiveId(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
        projects: state.data.projects,
});

const mapDispatchToProps = (dispatch) => ({
    deleteData: (props, dataType, id, nestedDataType, nestedId, skipRemove) => dispatch(deleteData(props, dataType, id, nestedDataType, nestedId, skipRemove)),
    submitData: (props, params) => dispatch(submitData(props, params)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Contribution);
