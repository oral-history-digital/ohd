import { connect } from 'react-redux';

import ContributionForm from '../components/ContributionForm';
import { closeArchivePopup } from '../actions/archivePopupActionCreators';
import { fetchData } from '../actions/dataActionCreators';
import { getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return { 
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        locales: (project && project.available_locales) || state.archive.locales,
        translations: state.archive.translations,
        people: state.data.people,
        peopleStatus: state.data.statuses.people,
        contributionTypes: state.archive.contributionTypes,
    }
}

const mapDispatchToProps = (dispatch) => ({
    closeArchivePopup: () => dispatch(closeArchivePopup()),
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ContributionForm);
