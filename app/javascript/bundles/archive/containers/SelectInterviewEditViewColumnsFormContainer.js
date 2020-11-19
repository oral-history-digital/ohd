import { connect } from 'react-redux';

import SelectInterviewEditViewColumnsForm from '../components/SelectInterviewEditViewColumnsForm';
import { closeArchivePopup } from '../actions/archivePopupActionCreators';
import { selectInterviewEditViewColumns } from '../actions/archiveActionCreators';
import { getInterview, getCookie } from '../../../lib/utils';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        translations: state.archive.translations,
        selectedInterviewEditViewColumns: state.archive.selectedInterviewEditViewColumns,
        interview: getInterview(state),
        account: state.data.accounts.current,
        editView: state.archive.editView,
    }
}

const mapDispatchToProps = (dispatch) => ({
    closeArchivePopup: () => dispatch(closeArchivePopup()),
    selectInterviewEditViewColumns: (params) => dispatch(selectInterviewEditViewColumns(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectInterviewEditViewColumnsForm);
