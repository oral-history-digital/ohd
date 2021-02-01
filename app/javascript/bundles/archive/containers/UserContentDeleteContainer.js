import { connect } from 'react-redux';

import UserContentDelete from '../components/UserContentDelete';
import { deleteData } from '../actions/dataActionCreators';
import { closeArchivePopup } from 'modules/ui';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
    }
}

const mapDispatchToProps = (dispatch) => ({
    deleteData: (props, dataType, id, nestedDataType, nestedId, skipRemove) => dispatch(deleteData(props, dataType, id, nestedDataType, nestedId, skipRemove)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(UserContentDelete);
