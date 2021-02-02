import { connect } from 'react-redux';

import { deleteData } from 'modules/data';
import { closeArchivePopup } from 'modules/ui';
import UserContentDelete from './UserContentDelete';

const mapStateToProps = state => ({
    locale: state.archive.locale,
    translations: state.archive.translations,
});

const mapDispatchToProps = (dispatch) => ({
    deleteData: (props, dataType, id, nestedDataType, nestedId, skipRemove) => dispatch(deleteData(props, dataType, id, nestedDataType, nestedId, skipRemove)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(UserContentDelete);
