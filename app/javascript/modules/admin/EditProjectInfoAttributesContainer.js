import { connect } from 'react-redux';

import { getCurrentProject } from 'modules/data';
import EditData from './EditData';
import { submitData } from 'modules/data';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        editView: state.archive.editView,
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

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditData);
