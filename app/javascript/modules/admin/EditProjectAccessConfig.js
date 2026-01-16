import AuthShowContainer from 'modules/auth/AuthShowContainer';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Helmet } from 'react-helmet';

import EditProjectAccessConfigAttributesContainer from './EditProjectAccessConfigAttributesContainer';
import EditViewOrRedirect from './EditViewOrRedirect';

export default function EditProjectConfig() {
    const { t } = useI18n();
    const { project } = useProject();

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

    if (project) {
        Object.entries(DEFAULT_FORM_ELEMENTS).forEach(([attribute, value]) => {
            formElements.push({
                elementType: 'extra',
                tag: 'h3',
                labelKey: `activerecord.attributes.user.${attribute}`,
            });
            formElements.push({
                elementType: 'input',
                attribute: `[${attribute}_setter]display`,
                labelKey: 'edit.default.display',
                value:
                    String(
                        project.access_config[attribute].display
                    ).toLowerCase() === 'true',
                type: 'checkbox',
            });
            formElements.push({
                elementType: 'input',
                attribute: `[${attribute}_setter]obligatory`,
                labelKey: 'edit.default.obligatory',
                value:
                    String(
                        project.access_config[attribute].obligatory
                    ).toLowerCase() === 'true',
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
                                project.access_config[attribute].values[value]
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
                <AuthShowContainer ifLoggedIn={true}>
                    <h1 className="registry-entries-title">
                        {t(`edit.project.access_config`)}
                    </h1>
                    <EditProjectAccessConfigAttributesContainer
                        data={project.access_config}
                        formElements={formElements}
                    />
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut={true} ifNoProject={true}>
                    {t('devise.failure.unauthenticated')}
                </AuthShowContainer>
            </div>
        </EditViewOrRedirect>
    );
}
