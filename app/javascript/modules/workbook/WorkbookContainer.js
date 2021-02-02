import { connect } from 'react-redux';

import { fetchData } from 'modules/data';
import Workbook from './Workbook';

const mapStateToProps = (state) => {
    return {
        projectId: state.archive.projectId,
        projects: state.data.projects,
        contents: state.data.user_contents,
        userContentsStatus: state.data.statuses.user_contents.all,
        // the following is just a trick to force rerender after deletion
        lastModified: state.data.statuses.user_contents.lastModified,
        locale: state.archive.locale,
        translations: state.archive.translations,
        account: state.data.accounts.current
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, dataId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, dataId, nestedDataType, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Workbook);
