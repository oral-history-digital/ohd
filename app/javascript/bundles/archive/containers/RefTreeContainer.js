import { connect } from 'react-redux';

import RefTree from '../components/RefTree';
import { fetchData } from 'modules/data';

import { getInterview } from 'lib/utils';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        interview: getInterview(state),
        refTreeStatus: state.data.statuses.ref_tree
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RefTree);
