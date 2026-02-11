import AuthShowContainer from 'modules/auth/AuthShowContainer';
import { getCurrentUser, submitData } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';

import EditData from './EditData';
import EditViewOrRedirect from './EditViewOrRedirect';

export default function EditProjectConfig() {
    const { t } = useI18n();
    const { project } = useProject();
    const dispatch = useDispatch();
    const user = useSelector(getCurrentUser);

    function submitHandler(props, params, opts, callback) {
        dispatch(submitData(props, params, opts, callback));
    }

    const formElements = [
        {
            attribute: 'shortname',
            validate: function (v) {
                return /^[-a-z0-9]{1,11}[a-z]$/.test(v);
            },
            hidden: !user?.admin,
        },
        {
            attribute: 'domain',
            help: 'activerecord.attributes.project.domain_help',
        },
        {
            attribute: 'publication_date',
            validate: function (v) {
                return /^\d{4}$/.test(v);
            },
        },
        {
            elementType: 'input',
            attribute: 'contact_email',
            type: 'email',
            validate: function (v) {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                    v
                );
            },
            help: 'activerecord.attributes.project.contact_email_help',
        },
        {
            elementType: 'input',
            attribute: 'has_newsletter',
            type: 'checkbox',
        },
        {
            elementType: 'input',
            attribute: 'is_catalog',
            type: 'checkbox',
        },
        {
            elementType: 'input',
            attribute: 'grant_project_access_instantly',
            type: 'checkbox',
        },
        {
            elementType: 'input',
            attribute: 'grant_access_without_login',
            type: 'checkbox',
        },
        {
            elementType: 'input',
            attribute: 'display_ohd_link',
            type: 'checkbox',
        },
        {
            elementType: 'input',
            attribute: 'show_preview_img',
            type: 'checkbox',
        },
        {
            elementType: 'input',
            attribute: 'show_legend',
            type: 'checkbox',
        },
        {
            attribute: 'archive_id_number_length',
            validate: function (v) {
                return /^\d+$/.test(v);
            },
            hidden: !user?.admin,
        },
        {
            attribute: 'default_locale',
            validate: function (v) {
                return /^[a-z]{2}$/.test(v);
            },
        },
        {
            attribute: 'pseudo_available_locales',
        },
        {
            attribute: 'pseudo_view_modes',
        },
        {
            attribute: 'fullname_on_landing_page',
            elementType: 'input',
            type: 'checkbox',
        },
        {
            attribute: 'has_map',
            elementType: 'input',
            type: 'checkbox',
        },
        {
            attribute: 'pseudo_upload_types',
        },
        {
            attribute: 'pseudo_logged_out_visible_registry_entry_ids',
        },
        {
            attribute: 'pseudo_hidden_registry_entry_ids',
            elementType: 'textarea',
        },
        {
            attribute: 'pseudo_hidden_transcript_registry_entry_ids',
        },
        {
            attribute: 'pseudo_pdf_registry_entry_ids',
        },
        {
            attribute: 'workflow_state',
            elementType: 'select',
            values: ['public', 'unshared'],
            optionsScope: 'workflow_states',
        },
    ];

    return (
        <EditViewOrRedirect>
            <div className="wrapper-content register">
                <Helmet>
                    <title>{t(`edit.project.config`)}</title>
                </Helmet>
                <AuthShowContainer ifLoggedIn={true}>
                    <h1 className="registry-entries-title">
                        {t(`edit.project.config`)}
                    </h1>
                    <EditData
                        data={project}
                        scope="project"
                        sensitiveAttributes={['contact_email']}
                        helpTextCode="archive_config_form"
                        formElements={formElements}
                        submitData={submitHandler}
                    />
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut={true} ifNoProject={true}>
                    {t('devise.failure.unauthenticated')}
                </AuthShowContainer>
            </div>
        </EditViewOrRedirect>
    );
}
