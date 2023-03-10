import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentProject, getProjectLocales, fetchData, deleteData, submitData,
    getCurrentAccount } from 'modules/data';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import DataList from './DataList';

const mapStateToProps = state => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        project: getCurrentProject(state),
        translations: getTranslations(state),
        account: getCurrentAccount(state),
        editView: true,
        //
        data: project.sponsor_logos,
        outerScope: 'project',
        outerScopeId: project.id,
        scope: 'sponsor_logo',
        detailsAttributes: ['src', 'locale'],
        initialFormValues: {ref_id: project.id, ref_type: 'Project', type: 'SponsorLogo'},
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
            {
                attribute: 'href',
            },
            {
                attribute: 'title',
            },
        ],
        helpTextCode: 'sponsor_logo_form'
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataList);
