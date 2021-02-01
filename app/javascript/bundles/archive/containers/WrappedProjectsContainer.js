import { connect } from 'react-redux';

import WrappedDataList from '../components/WrappedDataList';
import MetadataFieldsContainer from '../containers/MetadataFieldsContainer';
import TaskTypesContainer from '../containers/TaskTypesContainer';
import ExternalLinksContainer from '../containers/ExternalLinksContainer';
import UploadedFileContainer from '../containers/UploadedFileContainer';
import { setQueryParams } from '../actions/searchActionCreators';
import { openArchivePopup, closeArchivePopup } from 'modules/ui';
import { fetchData, deleteData, submitData } from '../actions/dataActionCreators';
import { getCookie, getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        editView: state.archive.editView,
        data: state.data.projects,
        dataStatus: state.data.statuses.projects,
        resultPagesCount: state.data.statuses.projects.resultPagesCount,
        query: state.search.projects.query,
        scope: 'project',
        baseTabIndex: 5 + project.has_map,
        detailsAttributes: ['title'],
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
                attribute: 'shortname',
                validate: function(v){return v.length > 1}
            },
            {
                attribute: "initials",
                validate: function(v){return /^[a-z]+$/.test(v)}
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
                attribute: "primary_color",
            },
            {
                attribute: "secondary_color",
            },
            {
                attribute: "editorial_color",
            },
            {
                attribute: "aspect_x",
                validate: function(v){return /^\d+$/.test(v)}
            },
            {
                attribute: "aspect_y",
                validate: function(v){return /^\d+$/.test(v)}
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
                attribute: "doi"
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
            {
                attribute: "contact_email"
            },
            {
                attribute: "smtp_server"
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
            {
                elementType: 'input',
                attribute: "has_newsletter",
                type: "checkbox"
            },
            {
                elementType: 'input',
                attribute: "is_catalog",
                type: "checkbox"
            }
        ],
        joinedData: {
            metadata_field: MetadataFieldsContainer,
            external_link: ExternalLinksContainer,
            logo: UploadedFileContainer,
            sponsor_logo: UploadedFileContainer,
        },
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    deleteData: (props, dataType, id, nestedDataType, nestedId, skipRemove) => dispatch(deleteData(props, dataType, id, nestedDataType, nestedId, skipRemove)),
    submitData: (props, params) => dispatch(submitData(props, params)),
    setQueryParams: (scope, params) => dispatch(setQueryParams(scope, params)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);
