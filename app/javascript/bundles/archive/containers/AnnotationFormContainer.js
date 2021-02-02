import { connect } from 'react-redux';

import AnnotationForm from '../components/AnnotationForm';
import { submitData } from 'modules/data';
import { closeArchivePopup } from 'modules/ui';
import { getLocale, getTranslations } from 'modules/archive';

const mapStateToProps = state => ({
    locale: getLocale(state),
    translations: getTranslations(state),
});

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(AnnotationForm);
