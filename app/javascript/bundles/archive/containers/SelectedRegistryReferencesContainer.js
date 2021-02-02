import { connect } from 'react-redux';
import SelectedRegistryReferences from '../components/SelectedRegistryReferences';
import { openArchivePopup, closeArchivePopup } from 'modules/ui';
import { fetchData } from 'modules/data';

import { getInterview, getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        editView: state.archive.editView,
        interview: getInterview(state),
        project: getProject(state),
        account: state.account,
    }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup()),
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectedRegistryReferences);
