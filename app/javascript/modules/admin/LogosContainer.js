import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { closeArchivePopup } from 'modules/ui';
import { getCurrentProject, fetchData, deleteData, submitData, getProjects, getCurrentAccount } from 'modules/data';
import { getLocale, getLocales, getProjectId, getTranslations } from 'modules/archive';
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
        scope: 'uploaded_file',
        detailsAttributes: ['src', 'locale'],
        initialFormValues: {ref_id: project.id, ref_type: 'Project', type: 'Logo'},
        formElements: [
            {
                attribute: "locale",
                elementType: 'select',
                values: getLocales(state),
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