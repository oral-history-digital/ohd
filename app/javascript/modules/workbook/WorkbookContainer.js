import { connect } from 'react-redux';

import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import { fetchData, getProjects, getUserContents, getCurrentAccount } from 'modules/data';
import Workbook from './Workbook';

const mapStateToProps = (state) => {
    return {
        projectId: getProjectId(state),
        projects: getProjects(state),
        contents: getUserContents(state),
        userContentsStatus: state.data.statuses.user_contents.all,
        // the following is just a trick to force rerender after deletion
        lastModified: state.data.statuses.user_contents.lastModified,
        locale: getLocale(state),
        translations: getTranslations(state),
        account: getCurrentAccount(state),
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, dataId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, dataId, nestedDataType, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Workbook);
