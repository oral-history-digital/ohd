import { connect } from 'react-redux';

import Annotation from '../components/Annotation';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { deleteData } from '../actions/dataActionCreators';
import { getLocale, getTranslations } from '../selectors/archiveSelectors';

const mapStateToProps = state => ({
    locale: getLocale(state),
    translations: getTranslations(state),
});

const mapDispatchToProps = (dispatch) => ({
    deleteData: (props, dataType, id, nestedDataType, nestedId, skipRemove) => dispatch(deleteData(props, dataType, id, nestedDataType, nestedId, skipRemove)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(Annotation);
