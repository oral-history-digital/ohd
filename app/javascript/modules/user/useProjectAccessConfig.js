import { useI18n } from 'modules/i18n';
import { findExternalLink } from 'modules/layout';

export default function useProjectAccessConfig(
    project,
    currentUser,
) {
    const { t, locale } = useI18n();
    const conditionsLink = findExternalLink(project, 'conditions');
    const tos_link = () => {
        return (
            <a href={conditionsLink[locale]} target="_blank" title="Externer Link" rel="noreferrer">
                {t('user.tos_agreement')}
            </a>
        )
    };

    const DEFAULT_FORM_ELEMENTS = {
        organization: {
            elementType: 'input',
            attribute: 'organization',
            label: t('activerecord.attributes.user.organization'),
            value: currentUser.organization,
            type: 'text',
            validate: String(project.access_config.organization.obligatory).toLowerCase() === 'true' && function(v){return v?.length > 1}
        },
        job_description: {
            elementType: 'select',
            attribute: 'job_description',
            label: t('activerecord.attributes.user.job_description'),
            optionsScope: 'user_project.job_description',
            value: currentUser.job_description,
            values: Object.entries(project.access_config.job_description.values).map(([key, value]) => String(value).toLowerCase() === 'true' && key),
            keepOrder: true,
            withEmpty: true,
            validate: String(project.access_config.job_description.obligatory).toLowerCase() === 'true' && function(v){return v?.length > 1}
        },
        research_intentions: {
            elementType: 'select',
            attribute: 'research_intentions',
            label: t('activerecord.attributes.user.research_intentions'),
            optionsScope: 'user_project.research_intentions',
            value: currentUser.research_intentions,
            values: Object.entries(project.access_config.research_intentions.values).map(([key, value]) => String(value).toLowerCase() === 'true' && key),
            keepOrder: true,
            withEmpty: true,
            validate: String(project.access_config.research_intentions.obligatory).toLowerCase() === 'true' && function(v){return v?.length > 1}
        },
        specification: {
            elementType: 'textarea',
            attribute: 'specification',
            label: t('activerecord.attributes.user.specification'),
            value: currentUser.specification,
            validate: String(project.access_config.specification.obligatory).toLowerCase() === 'true' && function(v){return v?.length > 10},
        },
        tos_agreement: {
            elementType: 'input',
            attribute: 'tos_agreement',
            labelKey: 'user.tos_agreement',
            type: 'checkbox',
            validate: true && function(v){return v && v !== '0'},
            help: t('user.notes_on_tos_agreement_archive', {
                project: project.name[locale],
                tos_link: tos_link(),
            })
        },
    };

    const formElements = [];
    Object.entries(DEFAULT_FORM_ELEMENTS).forEach(([key, value]) => {
        if (String(project.access_config[key].display).toLowerCase() === 'true') formElements.push(DEFAULT_FORM_ELEMENTS[key]);
    });

    return formElements;
}
