import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import { submitData, getCurrentProject, getProjectLocales, getProjects } from 'modules/data';
import EditData from './EditData';

const mapStateToProps = state => ({
    locale: getLocale(state),
    locales: getProjectLocales(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    translations: getTranslations(state),
    data: getCurrentProject(state),
    scope: 'project',
    helpTextCode: 'archive_info_form',
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
            attribute: "cooperation_partner"
        },
        {
            attribute: "leader"
        },
        {
            attribute: "manager"
        },
        {
            attribute: "pseudo_funder_names"
        },
    ],
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EditData);
