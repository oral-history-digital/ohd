import { connect } from 'react-redux';

import AnnotationForm from '../components/AnnotationForm';
import { submitData } from '../actions/dataActionCreators';
import { closeArchivePopup } from '../actions/archivePopupActionCreators';
import { getLocale, getTranslations } from '../selectors/archiveSelectors';

const mapStateToProps = state => ({
    currentLocale: getLocale(state),
    projectId: state.archive.projectId,
    translations: getTranslations(state),
});

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(AnnotationForm);
