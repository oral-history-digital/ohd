import { connect } from 'react-redux';

import { openArchivePopup, closeArchivePopup } from 'modules/ui';
import { deleteData, getProjects } from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import Data from './Data';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        translations: state.archive.translations,
    }
}

const mapDispatchToProps = (dispatch) => ({
    deleteData: (props, dataType, id, nestedDataType, nestedId, skipRemove) => dispatch(deleteData(props, dataType, id, nestedDataType, nestedId, skipRemove)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Data);
