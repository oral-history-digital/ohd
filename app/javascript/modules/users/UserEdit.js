import { useI18n } from 'modules/i18n';
import { useProjectIdentity } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import PropTypes from 'prop-types';

import ProjectsOverview from './ProjectsOverview';
import UserFormContainer from './UserFormContainer';

/**
 * Shows account or current-project access details and the existing user editor.
 * @param {Object} props - User record, user-list cache path, and save callback.
 * @returns {React.ReactElement} Project-scoped details or pending project identity.
 */
export default function UserEdit({ data, dataPath, onSubmit }) {
    const { t, locale } = useI18n();
    const { projectDbId, isUmbrella } = useProjectIdentity();
    if (!projectDbId || isUmbrella === undefined) return <Spinner />;
    const scope = isUmbrella ? 'user' : 'user_project';
    const userProject = Object.values(data.user_projects).find(
        (urp) => urp.project_id === projectDbId
    );

    const details = [
        'appellation',
        'first_name',
        'last_name',
        'email',
        'street',
        'zipcode',
        'city',
        'country',
        'confirmed_at',
        'default_locale',
    ];

    const projectDetails = [
        'organization',
        'job_description',
        'research_intentions',
        'specification',
        'processed_at',
        'terminated_at',
    ];

    const detailValue = (value, detail) => {
        if (
            ['confirmed_at', 'processed_at', 'terminated_at'].includes(detail)
        ) {
            return value
                ? new Date(value).toLocaleDateString(locale, {
                      dateStyle: 'medium',
                  })
                : null;
        }

        if (detail === 'job_description' || detail === 'research_intentions') {
            return t(`user_project.${detail}.${value}`);
        }

        if (detail === 'default_locale') {
            return value ? t(value) : '';
        }

        if (detail === 'country') {
            return value ? t(`countries.${value}`) : '';
        }

        return value;
    };

    const detailRepresentation = (value, detail, index) => {
        return (
            <p
                className="UserEdit-detail"
                key={`${detail}-${data.id}-${index}`}
            >
                <span className="UserEdit-detailName">
                    {t(`activerecord.attributes.user.${detail}`) + ': '}
                </span>
                <span className="UserEdit-detailContent">
                    {detailValue(value, detail)}
                </span>
            </p>
        );
    };

    return (
        <div className="UserEdit details">
            <section className="UserEdit-section">
                <h3>{t('user.registration')}</h3>
                <div className="UserEdit-details">
                    {details.map((detail, index) => {
                        return detailRepresentation(
                            data[detail] || userProject?.[detail],
                            detail,
                            index
                        );
                    })}
                </div>
            </section>

            {!isUmbrella && (
                <section className="UserEdit-section">
                    <h3>{t('modules.project_access.one')}</h3>
                    <div className="UserEdit-details">
                        {projectDetails.map((detail, index) => {
                            return detailRepresentation(
                                userProject?.[detail],
                                detail,
                                index
                            );
                        })}
                    </div>
                </section>
            )}

            {isUmbrella && (
                <section className="UserEdit-section">
                    <ProjectsOverview user={data} />
                </section>
            )}

            {(isUmbrella || userProject) && (
                <UserFormContainer
                    data={isUmbrella ? data : userProject}
                    dataPath={dataPath}
                    userId={data.id}
                    scope={scope}
                    onSubmit={onSubmit}
                />
            )}
        </div>
    );
}

UserEdit.propTypes = {
    data: PropTypes.object.isRequired,
    dataPath: PropTypes.string.isRequired,
    onSubmit: PropTypes.func,
};
