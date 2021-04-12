import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getLocales, getProjectId, getTranslations, getEditView } from 'modules/archive';
import { submitData, getCurrentProject, getProjects, getCurrentAccount } from 'modules/data';
import EditData from './EditData';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        locales: (project && project.available_locales) || getLocales(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        translations: getTranslations(state),
        account: getCurrentAccount(state),
        editView: getEditView(state),
        data: project,
        scope: 'project',
        formElements: [
            {
                attribute: 'name',
                multiLocale: true,
            },
            {
                attribute: 'introduction',
                elementType: 'richTextEditor',
                multiLocale: true,
            },
            {
                attribute: 'more_text',
                elementType: 'richTextEditor',
                multiLocale: true,
            },
            {
                attribute: 'landing_page_text',
                elementType: 'richTextEditor',
                multiLocale: true,
                help: 'activerecord.attributes.project.landing_page_edit_help'
            },
            {
                attribute: "domain",
                validate: function(v){return /^https?:\/\/[a-zA-Z0-9.-]+(:\d+)?$/.test(v)},
                help: 'activerecord.attributes.project.domain_help'
            },
            {
                attribute: "cooperation_partner"
            },
            {
                attribute: "leader"
            },
            {
                attribute: "manager"
            },
            {
                attribute: "hosting_institution"
            },
            {
                attribute: "pseudo_funder_names"
            },
        ],
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EditData);
