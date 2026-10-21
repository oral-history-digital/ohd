import AuthShowContainer from 'modules/auth/AuthShowContainer';
import { getCurrentUser, submitData } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';

import { EditData, EditViewOrRedirect, Logos } from '../../components';
import MediaStreams from './MediaStreams';
import ProjectFaviconForm from './ProjectFaviconForm';
import SponsorLogos from './SponsorLogos';

/**
 * Edits project settings from the authorized edit profile.
 * @returns {React.ReactElement} Settings form, loading indicator, or request error.
 */
export default function EditProjectDisplayPage() {
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

    const formElements = [
        {
            attribute: 'primary_color',
            elementType: 'colorPicker',
        },
        {
            attribute: 'secondary_color',
            elementType: 'colorPicker',
        },
        {
            attribute: 'editorial_color',
            elementType: 'colorPicker',
        },
        {
            attribute: 'aspect_x',
            validate: function (v) {
                return /^\d+$/.test(v);
            },
        },
        {
            attribute: 'aspect_y',
            validate: function (v) {
                return /^\d+$/.test(v);
            },
        },
    ];

    return (
        <EditViewOrRedirect>
            <div className="wrapper-content register">
                <Helmet>
                    <title>{t(`edit.project.display`)}</title>
                </Helmet>
                <AuthShowContainer hasProjectAccess>
                    <h1 className="Page-main-title">
                        {t(`edit.project.display`)}
                    </h1>
                    <EditData
                        data={project}
                        scope="project"
                        helpTextCode="archive_display_form"
                        formElements={formElements}
                        submitData={submitHandler}
                    />
                    <ProjectFaviconForm project={project} />
                    <h2>{t(`edit.logo.admin`)}</h2>
                    <Logos />
                    <h2>{t(`edit.sponsor_logo.admin`)}</h2>
                    <SponsorLogos />
                    {user?.admin && (
                        <>
                            <h2>{t(`edit.media_stream.admin`)}</h2>
                            <MediaStreams />
                        </>
                    )}
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut={true} ifNoProject={true}>
                    {t('devise.failure.unauthenticated')}
                </AuthShowContainer>
            </div>
        </EditViewOrRedirect>
    );
}
