import { connect } from 'react-redux';
import AdminActions from '../components/AdminActions';
import { 
    submitDois, 
    addRemoveArchiveId,
    setArchiveIds
} from '../actions/archiveActionCreators';
import { deleteData, submitData } from '../actions/dataActionCreators';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        statuses: state.data.statuses.interviews,
        doiResult: state.archive.doiResult,
        archiveSearchResults: state.search.interviews
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitDois: (params, locale) => dispatch(submitDois(params, locale)),
    addRemoveArchiveId: (archiveId) => dispatch(addRemoveArchiveId(archiveId)),
    setArchiveIds: (archiveIds) => dispatch(setArchiveIds(archiveIds)),
    deleteData: (props, dataType, id, nestedDataType, nestedId, skipRemove) => dispatch(deleteData(props, dataType, id, nestedDataType, nestedId, skipRemove)),
    submitData: (props, params) => dispatch(submitData(props, params)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminActions);
