import { getCurrentProject } from 'modules/data';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import ProjectsOverview from './ProjectsOverview';
import UserFormContainer from './UserFormContainer';

export default function UserEdit({ data, dataPath, onSubmit }) {
    const { t, locale } = useI18n();
    const project = useSelector(getCurrentProject);
    const scope = project.is_ohd ? 'user' : 'user_project';
    const userProject = Object.values(data.user_projects).find(
        (urp) => urp.project_id === project.id
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

            {!project.is_ohd && (
                <section className="UserEdit-section">
                    <h3>{t('modules.project_access.one')}</h3>
                    <div className="UserEdit-details">
                        {projectDetails.map((detail, index) => {
                            return detailRepresentation(
                                userProject[detail],
                                detail,
                                index
                            );
                        })}
                    </div>
                </section>
            )}

            {project.is_ohd && (
                <section className="UserEdit-section">
                    <ProjectsOverview user={data} />
                </section>
            )}

            <UserFormContainer
                data={project.is_ohd ? data : userProject}
                dataPath={dataPath}
                userId={data.id}
                scope={scope}
                onSubmit={onSubmit}
            />
        </div>
    );
}

UserEdit.propTypes = {
    data: PropTypes.object.isRequired,
    dataPath: PropTypes.string.isRequired,
    onSubmit: PropTypes.func,
};
