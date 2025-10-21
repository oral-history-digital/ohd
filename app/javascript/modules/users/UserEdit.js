import { useSelector } from 'react-redux';

import UserFormContainer from './UserFormContainer';
import { useI18n } from 'modules/i18n';
import { getCurrentProject } from 'modules/data';
import ProjectsOverview from './ProjectsOverview';

export default function UserEdit ({
    data,
    dataPath,
    onSubmit,
}) {

    const { t, locale } = useI18n();
    const project = useSelector(getCurrentProject);
    const scope = project.is_ohd ? 'user' : 'user_project';
    const userProject = Object.values(data.user_projects).find(urp => urp.project_id === project.id);

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
        if (['confirmed_at', 'processed_at', 'terminated_at'].includes(detail)) {
            return value ? new Date(value).toLocaleDateString(locale, { dateStyle: 'medium' }) : null;
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
            <p className="detail"
               key={`${detail}-${data.id}-${index}`}
            >
                <span className='name'>{t(`activerecord.attributes.user.${detail}`) + ': '}</span>
                <span className='content'>{detailValue(value, detail)}</span>
            </p>
        )
    }

    return (
        <div className='details'>
            <h3>{t('user.registration')}</h3>
            { details.map((detail, index) => {
                return (detailRepresentation(data[detail] || userProject?.[detail], detail, index));
            })}

            { !project.is_ohd && <h3>{t('modules.project_access.one')}</h3> }
            { !project.is_ohd && projectDetails.map((detail, index) => {
                return (detailRepresentation(userProject[detail], detail, index));
            })}

            { project.is_ohd && <ProjectsOverview user={data} /> }

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
