import { useI18n } from 'modules/i18n';
import { pathBase } from 'modules/routes';

/**
 * Builds visible access-request fields from the loaded display configuration.
 *
 * @param {Object|undefined} project - Project with localized strings and boolean settings.
 * @param {Object|undefined} currentUserProject - Existing access request, if any.
 * @param {Object} currentUser - Account values used to prefill the form.
 * @returns {Object[]} Visible fields; empty when configuration is unavailable.
 */
export default function useProjectAccessConfig(
    project,
    currentUserProject,
    currentUser
) {
    const { t, locale } = useI18n();
    if (!project?.access_config) return [];

    const conditionsLink = `${project.archive_domain || ''}${pathBase({ project, locale })}/conditions`;

    const tosLink = () => {
        return (
            <a
                href={conditionsLink}
                target="_blank"
                title="Externer Link"
                rel="noreferrer"
            >
                {t('user.tos_agreement')}
            </a>
        );
    };

    const DEFAULT_FORM_ELEMENTS = {
        organization: {
            elementType: 'input',
            attribute: 'organization',
            label: t('activerecord.attributes.user.organization'),
            value: currentUser.organization,
            type: 'text',
            validate:
                project.access_config.organization.obligatory &&
                function (v) {
                    return v?.length > 1;
                },
        },
        job_description: {
            elementType: 'select',
            attribute: 'job_description',
            label: t('activerecord.attributes.user.job_description'),
            optionsScope: 'user_project.job_description',
            value: currentUser.job_description,
            values: Object.entries(project.access_config.job_description.values)
                .filter(([, enabled]) => enabled)
                .map(([key]) => key),
            keepOrder: true,
            withEmpty: true,
            validate:
                project.access_config.job_description.obligatory &&
                function (v) {
                    return v?.length > 1;
                },
        },
        research_intentions: {
            elementType: 'select',
            attribute: 'research_intentions',
            label: t('activerecord.attributes.user.research_intentions'),
            optionsScope: 'user_project.research_intentions',
            value: currentUserProject?.research_intentions,
            values: Object.entries(
                project.access_config.research_intentions.values
            )
                .filter(([, enabled]) => enabled)
                .map(([key]) => key),
            keepOrder: true,
            withEmpty: true,
            validate:
                project.access_config.research_intentions.obligatory &&
                function (v) {
                    return v?.length > 1;
                },
        },
        specification: {
            elementType: 'textarea',
            attribute: 'specification',
            label: t('activerecord.attributes.user.specification'),
            value: currentUserProject?.specification,
            validate:
                project.access_config.specification.obligatory &&
                function (v) {
                    return v?.length > 10;
                },
        },
        tos_agreement: {
            elementType: 'input',
            attribute: 'tos_agreement',
            labelKey: 'user.tos_agreement',
            type: 'checkbox',
            validate: function (v) {
                return v && v !== '0';
            },
            help: t('user.notes_on_tos_agreement_archive', {
                project: project.name,
                tos_link: tosLink(),
            }),
        },
    };

    return Object.entries(DEFAULT_FORM_ELEMENTS)
        .filter(([key]) => project.access_config[key].display)
        .map(([, field]) => field);
}
