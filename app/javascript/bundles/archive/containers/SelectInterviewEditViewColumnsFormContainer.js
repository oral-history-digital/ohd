import { connect } from 'react-redux';

import SelectInterviewEditViewColumnsForm from '../components/SelectInterviewEditViewColumnsForm';
import { closeArchivePopup } from '../actions/archivePopupActionCreators';
import { selectInterviewEditViewColumns } from '../actions/archiveActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        translations: state.archive.translations,
        selectedInterviewEditViewColumns: state.archive.selectedInterviewEditViewColumns,
    }
}

const mapDispatchToProps = (dispatch) => ({
    closeArchivePopup: () => dispatch(closeArchivePopup()),
    selectInterviewEditViewColumns: (params) => dispatch(selectInterviewEditViewColumns(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectInterviewEditViewColumnsForm);
