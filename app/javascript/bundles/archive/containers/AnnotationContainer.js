import { connect } from 'react-redux';

import Annotation from '../components/Annotation';
import { openArchivePopup, closeArchivePopup } from 'modules/ui';
import { deleteData } from 'modules/data';
import { getLocale, getTranslations } from 'modules/archive';

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
