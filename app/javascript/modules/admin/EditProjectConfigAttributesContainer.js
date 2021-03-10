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
                attribute: 'shortname',
                validate: function(v){return v.length > 1}
            },
            {
                attribute: "initials",
                validate: function(v){return /^[a-zA-Z]+$/.test(v)}
            },
            {
                attribute: "domain",
                validate: function(v){return /^https?:\/\/[a-zA-Z0-9.-]+(:\d+)?$/.test(v)},
                help: 'activerecord.attributes.project.domain_help'
            },
            {
                attribute: "archive_domain",
                validate: function(v){return /^https?:\/\/[a-zA-Z0-9.-]+(:\d+)?$/.test(v)},
                help: 'activerecord.attributes.project.archive_domain_help'
            },
            {
                attribute: "contact_email"
            },
            {
                attribute: "smtp_server"
            },
            {
                elementType: 'input',
                attribute: "has_newsletter",
                type: "checkbox"
            },
            {
                elementType: 'input',
                attribute: "is_catalog",
                type: "checkbox"
            },
            {
                attribute: "doi"
            },
            {
                attribute: "archive_id_number_length",
                validate: function(v){return /^\d+$/.test(v)}
            },
            {
                attribute: 'default_locale',
                validate: function(v){return /^[a-z]{2}$/.test(v)}
            },
            {
                attribute: "pseudo_available_locales",
            },
            {
                attribute: "pseudo_view_modes",
            },
            {
                attribute: "fullname_on_landing_page",
                elementType: 'input',
                type: "checkbox",
            },
            {
                attribute: "has_map",
                elementType: 'input',
                type: "checkbox",
            },
            {
                attribute: "pseudo_upload_types",
            },
            {
                attribute: "pseudo_hidden_registry_entry_ids"
            },
            {
                attribute: "pseudo_hidden_transcript_registry_entry_ids"
            },
            {
                attribute: "pseudo_pdf_registry_entry_ids"
            },
        ],
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditData);
