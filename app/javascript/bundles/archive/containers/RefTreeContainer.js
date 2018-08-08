import { connect } from 'react-redux';

import RefTree from '../components/RefTree';
import { fetchData } from '../actions/dataActionCreators';

import { getInterview } from '../../../lib/utils';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        interview: getInterview(state),
        refTreeStatus: state.data.statuses.ref_tree
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (dataType, archiveId, nestedDataType) => dispatch(fetchData(dataType, archiveId, nestedDataType)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RefTree);
