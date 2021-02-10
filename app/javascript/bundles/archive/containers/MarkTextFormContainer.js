import { connect } from 'react-redux';

import MarkTextForm from '../components/MarkTextForm';
import { fetchData, submitData, getCurrentInterview } from 'modules/data';
import { getProject } from 'lib/utils';
import { closeArchivePopup } from 'modules/ui';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        archiveId: state.archive.archiveId,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        interview: getCurrentInterview(state),
        markTextStatus: state.data.statuses.mark_text,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    submitData: (props, params) => dispatch(submitData(props, params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(MarkTextForm);
