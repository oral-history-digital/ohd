import AuthShowContainer from 'modules/auth/AuthShowContainer';
import { submitData } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import { Helmet } from 'react-helmet';
import { useDispatch } from 'react-redux';

import { EditData, EditViewOrRedirect } from '../../components';
import {
    getInitialFormValuesFromElements,
    transformBracketNotationToNested,
} from '../../utils';

/**
 * Reads editable access settings from Redux and saves through the existing setter endpoint.
 *
 * @returns {React.ReactElement} Access configuration, loading indicator, or request error.
 */
export default function EditProjectAccessPage() {
    const { t } = useI18n();
    const { project, error, isLoading, isValidating } = useProject({
        profile: 'edit',
        include: ['access_config'],
    });
    const dispatch = useDispatch();

    /**
     * Converts checkbox setters to Rails hashes and waits for the server to invalidate reads.
     *
     * @param {Object} props - Current project and locale for the save URL.
     * @param {Object} params - Access configuration ID and checkbox values.
     * @param {Object} opts - Shared form submission options.
     * @param {Function} callback - Called after a successful save.
     */
    function submitHandler(props, params, opts, callback) {
        const transformedParams = transformBracketNotationToNested(params);
        // An optimistic legacy write would refetch these settings before the save finishes.
        dispatch(
            submitData(
                props,
                transformedParams,
                { ...opts, updateStateBeforeSubmit: false },
                callback
            )
        );
    }

    const formElements = [];
    const DEFAULT_FORM_ELEMENTS = {
        organization: {},
        job_description: {
            values: [
                'researcher',
                'filmmaker',
                'journalist',
                'teacher',
                'memorial_staff',
                'pupil',
                'student',
                'other',
            ],
        },
        research_intentions: {
            values: [
                'exhibition',
                'education',
                'film',
                'memorial_culture_project',
                'genealogy',
                'art',
                'personal_interest',
                'press_publishing',
                'school_project',
                'university_teaching',
                'scientific_paper',
                'other',
            ],
        },
        specification: {},
        tos_agreement: {},
    };

    if (project?.access_config) {
        Object.entries(DEFAULT_FORM_ELEMENTS).forEach(([attribute]) => {
            const accessConfig = project.access_config[attribute] || {};
            formElements.push({
                elementType: 'extra',
                tag: 'h3',
                labelKey: `activerecord.attributes.user.${attribute}`,
            });
            formElements.push({
                elementType: 'input',
                attribute: `[${attribute}_setter]display`,
                labelKey: 'edit.default.display',
                value: accessConfig.display === true,
                type: 'checkbox',
            });
            formElements.push({
                elementType: 'input',
                attribute: `[${attribute}_setter]obligatory`,
                labelKey: 'edit.default.obligatory',
                value: accessConfig.obligatory === true,
                type: 'checkbox',
            });
            if (DEFAULT_FORM_ELEMENTS[attribute].values) {
                DEFAULT_FORM_ELEMENTS[attribute].values.forEach((value) => {
                    formElements.push({
                        elementType: 'input',
                        attribute: `[${attribute}_setter][values]${value}`,
                        labelKey: `user_project.${attribute}.${value}`,
                        className: 'is-option',
                        value: accessConfig.values?.[value] === true,
                        type: 'checkbox',
                    });
                });
            }
        });
    }

    return (
        <EditViewOrRedirect>
            <div className="wrapper-content register">
                <Helmet>
                    <title>{t(`edit.project.access_config`)}</title>
                </Helmet>
                <AuthShowContainer hasProjectAccess>
                    <h1 className="Page-main-title">
                        {t(`edit.project.access_config`)}
                    </h1>
                    {error ? (
                        <InlineNotification
                            variant="error"
                            title={t('error')}
                            description={error.message}
                            isClosable={false}
                        />
                    ) : isLoading ? (
                        <Spinner />
                    ) : project?.access_config ? (
                        <EditData
                            data={project.access_config}
                            scope="access_config"
                            initialFormValues={getInitialFormValuesFromElements(
                                formElements
                            )}
                            helpTextCode="access_config_form"
                            formElements={formElements}
                            submitData={submitHandler}
                            isLoading={isValidating}
                        />
                    ) : (
                        <InlineNotification
                            variant="error"
                            title={t('error')}
                            isClosable={false}
                        />
                    )}
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut={true} ifNoProject={true}>
                    {t('devise.failure.unauthenticated')}
                </AuthShowContainer>
            </div>
        </EditViewOrRedirect>
    );
}
