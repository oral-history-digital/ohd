import { connect } from 'react-redux';

import SegmentForm from '../components/SegmentForm';
import { submitData } from '../actions/dataActionCreators';
import { closeArchivePopup } from '../actions/archivePopupActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        locales: state.archive.locales,
        translations: state.archive.translations,
        people: state.data.people,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (params, locale) => dispatch(submitData(params, locale)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(SegmentForm);
