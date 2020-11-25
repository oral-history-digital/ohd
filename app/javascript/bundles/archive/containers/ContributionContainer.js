import { connect } from 'react-redux';

import Contribution from '../components/Contribution';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { deleteData, submitData } from '../actions/dataActionCreators';
import { getLocale, getArchiveId, getProjectId } from '../selectors/archiveSelectors';

const mapStateToProps = state => ({
    archiveId: getArchiveId(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
});

const mapDispatchToProps = (dispatch) => ({
    deleteData: (props, dataType, id, nestedDataType, nestedId, skipRemove) => dispatch(deleteData(props, dataType, id, nestedDataType, nestedId, skipRemove)),
    submitData: (props, params) => dispatch(submitData(props, params)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Contribution);
