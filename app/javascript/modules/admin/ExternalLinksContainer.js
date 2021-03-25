import { connect } from 'react-redux';

import { closeArchivePopup } from 'modules/ui';
import { getCurrentProject, fetchData, deleteData, submitData, getProjects } from 'modules/data';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import DataList from './DataList';

const mapStateToProps = state => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        translations: getTranslations(state),
        account: state.data.accounts.current,
        editView: true,
        data: project.external_links,
        scope: 'external_link',
        detailsAttributes: ['name', 'url'],
        initialFormValues: {project_id: project.id},
        formElements: [
            {
                attribute: "internal_name"
            },
            {
                attribute: 'name',
                multiLocale: true,
            },
            {
                attribute: 'url',
                multiLocale: true,
            },
        ],
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    deleteData: (props, dataType, id, nestedDataType, nestedId, skipRemove) => dispatch(deleteData(props, dataType, id, nestedDataType, nestedId, skipRemove)),
    submitData: (props, params) => dispatch(submitData(props, params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(DataList);
