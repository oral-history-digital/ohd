import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { closeArchivePopup } from 'modules/ui';
import { getCurrentProject, fetchData, deleteData, submitData, getProjects,
    getCurrentAccount, getProjectLocales } from 'modules/data';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import DataList from './DataList';

const mapStateToProps = state => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        translations: getTranslations(state),
        account: getCurrentAccount(state),
        editView: true,
        //
        data: project.logos,
        outerScope: 'project',
        outerScopeId: project.id,
        scope: 'logo',
        detailsAttributes: ['src', 'locale'],
        initialFormValues: {ref_id: project.id, ref_type: 'Project', type: 'Logo'},
        formElements: [
            {
                attribute: "locale",
                elementType: 'select',
                values: getProjectLocales(state),
                withEmpty: true,
            },
            {
                attribute: 'file',
                elementType: 'input',
                type: 'file',
            },
        ],
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    submitData,
    closeArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataList);
