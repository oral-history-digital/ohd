import { connect } from 'react-redux';

import { fetchData, submitData, getCurrentInterview, getProjects } from 'modules/data';
import { closeArchivePopup } from 'modules/ui';
import { getLocale, getProjectId, getArchiveId, getTranslations } from 'modules/archive';
import MarkTextForm from './MarkTextForm';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        archiveId: getArchiveId(state),
        translations: getTranslations(state),
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
