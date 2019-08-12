import { connect } from 'react-redux';

import MarkTextForm from '../components/MarkTextForm';
import { fetchData, submitData } from '../actions/dataActionCreators';
import { getInterview } from '../../../lib/utils';
import { closeArchivePopup } from '../actions/archivePopupActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        locales: state.archive.locales,
        archiveId: state.archive.archiveId,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        interview: getInterview(state),
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (dataType, archiveId, nestedDataType, locale, extraParams) => dispatch(fetchData(dataType, archiveId, nestedDataType, locale, extraParams)),
    submitData: (params) => dispatch(submitData(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(MarkTextForm);
