import { connect } from 'react-redux';

import Annotations from '../components/Annotations';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { fetchData } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        translations: state.archive.translations,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (dataType, archiveId, nestedDataType, locale, extraParams) => dispatch(fetchData(dataType, archiveId, nestedDataType, locale, extraParams)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Annotations);
