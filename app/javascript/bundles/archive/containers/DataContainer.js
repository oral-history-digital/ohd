import { connect } from 'react-redux';

import Data from '../components/Data';
import { openArchivePopup, closeArchivePopup } from 'modules/ui';
import { deleteData } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
    }
}

const mapDispatchToProps = (dispatch) => ({
    deleteData: (props, dataType, id, nestedDataType, nestedId, skipRemove) => dispatch(deleteData(props, dataType, id, nestedDataType, nestedId, skipRemove)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Data);
