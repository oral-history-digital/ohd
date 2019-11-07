import { connect } from 'react-redux';

import WrappedDataList from '../components/WrappedDataList';
import MetadataFieldsContainer from '../containers/MetadataFieldsContainer';
import ExternalLinksContainer from '../containers/ExternalLinksContainer';
import { setQueryParams } from '../actions/searchActionCreators';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { fetchData, deleteData, submitData } from '../actions/dataActionCreators';
import { getCookie, getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return { 
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        editView: state.archive.editView,
        data: state.data.projects,
        dataStatus: state.data.statuses.projects,
        resultPagesCount: state.data.statuses.projects.resultPagesCount,
        query: state.search.projects.query,
        scope: 'project',
        baseTabIndex: 5,
        detailsAttributes: ['title'],
        formElements: [
            {
                attribute: 'name',
                elementType: 'multiLocaleInput'
            },
            {
                attribute: 'shortname',
                validate: function(v){return v.length > 1} 
            },
            {
                attribute: "initials"
            },
            {
                attribute: 'default_locale',
                validate: function(v){return /^[a-z]{2}$/.test(v)}
            },
            {
                attribute: "available_locales",
            },
            {
                attribute: "view_modes",
            },
            {
                attribute: "fullname_on_landing_page",
                elementType: 'input',
                type: "checkbox",
            },
            {
                attribute: "upload_types",
            },
            //{
                //attribute: "primary_color_rgb",
            //},
            {
                attribute: "domain"
            },
            {
                attribute: "archive_domain"
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
                attribute: "funder_names"
            },
            {
                attribute: "contact_email"
            },
            {
                attribute: "smtp_server"
            },
            {
                attribute: "hidden_registry_entry_ids"
            },
            {
                attribute: "pdf_registry_entry_codes"
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
