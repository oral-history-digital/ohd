import AuthShowContainer from 'modules/auth/AuthShowContainer';
import { getIsLoading, submitData } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';

import { EditData, EditViewOrRedirect } from '../../components';
import CooperationPartners from './CooperationPartners';
import ExternalLinks from './ExternalLinks';
import Funders from './Funders';
import InstitutionProjects from './InstitutionProjects';
import Leaders from './Leaders';
import Managers from './Managers';

/**
 * Edits project settings from the authorized edit profile.
 * @returns {React.ReactElement} Settings form, loading indicator, or request error.
 */
export default function EditProjectInfoPage() {
    const { t } = useI18n();
    const {
        project,
        error,
        isLoading: projectLoading,
    } = useProject({ profile: 'edit', include: ['translations'] });
    const dispatch = useDispatch();
    const isLoading = useSelector((state) =>
        getIsLoading(state, project ? 'projects' : null, project?.id)
    );

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

    const formElements = [
        {
            attribute: 'name',
            multiLocale: true,
            baseLocales: ['de', 'en'],
        },
        {
            attribute: 'introduction',
            elementType: 'richTextEditor',
            multiLocale: true,
            baseLocales: ['de', 'en'],
        },
        {
            attribute: 'more_text',
            elementType: 'richTextEditor',
            multiLocale: true,
            baseLocales: ['de', 'en'],
        },
        {
            attribute: 'landing_page_text',
            elementType: 'richTextEditor',
            multiLocale: true,
            baseLocales: ['de', 'en'],
            help: 'activerecord.attributes.project.landing_page_edit_help',
        },
        {
            attribute: 'restricted_landing_page_text',
            elementType: 'richTextEditor',
            multiLocale: true,
            baseLocales: ['de', 'en'],
            help: 'activerecord.attributes.project.restricted_landing_page_edit_help',
        },
        {
            attribute: 'media_missing_text',
            multiLocale: true,
            baseLocales: ['de', 'en'],
        },
    ];

    return (
        <EditViewOrRedirect>
            <div className="wrapper-content register">
                <Helmet>
                    <title>{t('edit.project.info')}</title>
                </Helmet>
                <AuthShowContainer hasProjectAccess>
                    <h1 className="Page-main-title">
                        {t(`edit.project.info`)}
                    </h1>
                    <EditData
                        data={project}
                        scope="project"
                        helpTextCode="archive_info_form"
                        formElements={formElements}
                        submitData={submitHandler}
                        isLoading={isLoading}
                    />
                    <h2>{t('edit.cooperation_partner.admin')}</h2>
                    <CooperationPartners />
                    <h2>{t('edit.leader.admin')}</h2>
                    <Leaders />
                    <h2>{t('edit.manager.admin')}</h2>
                    <Managers />
                    <h2>{t('edit.funder.admin')}</h2>
                    <Funders />

                    <h2>{t(`edit.external_link.admin`)}</h2>
                    <ExternalLinks />

                    <h2>{t(`edit.institution_project.admin`)}</h2>
                    <InstitutionProjects />
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut={true} ifNoProject={true}>
                    {t('devise.failure.unauthenticated')}
                </AuthShowContainer>
            </div>
        </EditViewOrRedirect>
    );
}
