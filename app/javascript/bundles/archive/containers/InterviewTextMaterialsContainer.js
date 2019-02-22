import { connect } from 'react-redux';
import InterviewTextMaterials from '../components/InterviewTextMaterials';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { fetchData } from '../actions/dataActionCreators';

import { getInterview } from '../../../lib/utils';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        editView: state.archive.editView,
        interview: getInterview(state),
        // the following is just a trick to force rerender after deletion
        account: state.data.accounts.current,
    }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup()),
    fetchData: (dataType, archiveId, nestedDataType, locale, extraParams) => dispatch(fetchData(dataType, archiveId, nestedDataType, locale, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewTextMaterials);
