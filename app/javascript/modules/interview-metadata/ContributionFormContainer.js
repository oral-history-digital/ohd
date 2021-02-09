import { connect } from 'react-redux';

import { closeArchivePopup } from 'modules/ui';
import { fetchData } from 'modules/data';
import { getProject } from 'lib/utils';
import ContributionForm from './ContributionForm';

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
        contributionTypes: state.data.contribution_types,
    }
}

const mapDispatchToProps = (dispatch) => ({
    closeArchivePopup: () => dispatch(closeArchivePopup()),
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ContributionForm);
