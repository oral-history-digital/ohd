import { getCurrentProject, submitData } from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import EditData from './EditData';

const mapStateToProps = (state) => ({
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
            help: 'activerecord.attributes.project.landing_page_edit_help',
        },
        {
            attribute: 'restricted_landing_page_text',
            elementType: 'richTextEditor',
            multiLocale: true,
            help: 'activerecord.attributes.project.restricted_landing_page_edit_help',
        },
        {
            attribute: 'cooperation_partner',
        },
        {
            attribute: 'leader',
        },
        {
            attribute: 'manager',
        },
        {
            attribute: 'pseudo_funder_names',
        },
        {
            attribute: 'media_missing_text',
            multiLocale: true,
        },
    ],
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            submitData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(EditData);
