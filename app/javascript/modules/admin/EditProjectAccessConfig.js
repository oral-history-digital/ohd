import AuthShowContainer from 'modules/auth/AuthShowContainer';
import {
    getIsLoading,
    submitData,
    useHydrateProjectsByIds,
} from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';

import EditData from './EditData';
import EditViewOrRedirect from './EditViewOrRedirect';
import { getInitialFormValuesFromElements } from './utils/formUtils';
import { transformBracketNotationToNested } from './utils/transformBracketNotation';

export default function EditProjectAccessConfig() {
    const { t } = useI18n();
    const { project, projectDbId } = useProject();
    const dispatch = useDispatch();
    const isLoading = useSelector((state) =>
        getIsLoading(state, project ? 'projects' : null, project?.id)
    );

    // Hydrate the project if it doesn't have an access_config yet
    useHydrateProjectsByIds([projectDbId], {
        needsHydration: (candidateProject) => !candidateProject?.access_config,
    });

    function submitHandler(props, params, opts, callback) {
        // Transform bracket notation attributes into nested objects
        const transformedParams = transformBracketNotationToNested(params);
        dispatch(submitData(props, transformedParams, opts, callback));
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
                value: String(accessConfig.display).toLowerCase() === 'true',
                type: 'checkbox',
            });
            formElements.push({
                elementType: 'input',
                attribute: `[${attribute}_setter]obligatory`,
                labelKey: 'edit.default.obligatory',
                value: String(accessConfig.obligatory).toLowerCase() === 'true',
                type: 'checkbox',
            });
            if (DEFAULT_FORM_ELEMENTS[attribute].values) {
                DEFAULT_FORM_ELEMENTS[attribute].values.map((value) => {
                    formElements.push({
                        elementType: 'input',
                        attribute: `[${attribute}_setter][values]${value}`,
                        labelKey: `user_project.${attribute}.${value}`,
                        className: 'is-option',
                        value:
                            String(
                                accessConfig.values?.[value]
                            ).toLowerCase() === 'true',
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
                    {project?.access_config ? (
                        <EditData
                            data={project.access_config}
                            scope="access_config"
                            initialFormValues={getInitialFormValuesFromElements(
                                formElements
                            )}
                            helpTextCode="access_config_form"
                            formElements={formElements}
                            submitData={submitHandler}
                            isLoading={isLoading}
                        />
                    ) : (
                        <Spinner />
                    )}
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut={true} ifNoProject={true}>
                    {t('devise.failure.unauthenticated')}
                </AuthShowContainer>
            </div>
        </EditViewOrRedirect>
    );
}
