import { connect } from 'react-redux';
import AdminActions from '../components/AdminActions';
import { submitDois } from '../actions/archiveActionCreators';
import { addRemoveArchiveId } from '../actions/archiveActionCreators';
import { deleteData } from '../actions/dataActionCreators';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        statuses: state.data.statuses.interviews,
        doiResult: state.archive.doiResult
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitDois: (params, locale) => dispatch(submitDois(params, locale)),
    addRemoveArchiveId: (archiveId) => dispatch(addRemoveArchiveId(archiveId)),
    deleteData: (dataType, id, nestedDataType, nestedId, skipRemove, locale) => dispatch(deleteData(dataType, id, nestedDataType, nestedId, skipRemove, locale)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminActions);
