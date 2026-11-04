import AuthShowContainer from 'modules/auth/AuthShowContainer';
import { getCurrentUser, submitData } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';

import { EditData, EditViewOrRedirect } from '../../components';

/**
 * Edits project settings from the authorized edit profile.
 * @returns {React.ReactElement} Settings form, loading indicator, or request error.
 */
export default function EditProjectConfigPage() {
    const { t } = useI18n();
    const {
        project,
        error,
        isLoading: projectLoading,
    } = useProject({ profile: 'edit' });
    const dispatch = useDispatch();
    const user = useSelector(getCurrentUser);

    /**
     * Saves settings before invalidating the project read.
     * @param {Object} props - Route context.
     * @param {Object} params - Form values.
     * @param {Object} opts - Submission options.
     * @param {Function} callback - Successful save callback.
     */
    function submitHandler(props, params, opts, callback) {
        // Refetch only after the server saves, so an optimistic write cannot replace the draft.
        dispatch(
            submitData(
                props,
                params,
                { ...opts, updateStateBeforeSubmit: false },
                callback
            )
        );
    }

    if (error) {
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );
    }
    if (projectLoading || !project) return <Spinner />;

    // The legacy save endpoint still accepts comma-separated setters; Redux keeps arrays.
    const formProject = { ...project };
    [
        'available_locales',
        'view_modes',
        'upload_types',
        'logged_out_visible_registry_entry_ids',
        'hidden_registry_entry_ids',
        'hidden_transcript_registry_entry_ids',
        'pdf_registry_entry_ids',
    ].forEach((field) => {
        formProject[`pseudo_${field}`] = (project[field] || []).join(', ');
    });

    const formElements = [
        {
            attribute: 'shortname',
            help: 'activerecord.attributes.project.shortname_help',
            validate: function (v) {
                return /^[-a-z0-9]{1,11}[a-z]$/.test(v);
            },
            hidden: !user?.admin,
        },
        {
            attribute: 'display_shortname',
            help: 'activerecord.attributes.project.display_shortname_help',
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
                return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
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
                <AuthShowContainer hasProjectAccess>
                    <h1 className="Page-main-title">
                        {t(`edit.project.config`)}
                    </h1>
                    <EditData
                        data={formProject}
                        scope="project"
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
