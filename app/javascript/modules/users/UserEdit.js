import { useSelector } from 'react-redux';

import UserFormContainer from './UserFormContainer';
import { useI18n } from 'modules/i18n';
import { getCurrentProject } from 'modules/data';

export default function UserEdit ({
    data,
    dataPath,
    onSubmit,
}) {

    const { t, locale } = useI18n();
    const project = useSelector(getCurrentProject);
    const scope = project.shortname === 'ohd' ? 'user' : 'user_project';
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

    if (!project.is_ohd) details.concat([
        'organization',
        'job_description',
        'research_intentions',
        'specification',
        'processed_at',
        'terminated_at',
    ]);

    return (
        <div className='details'>
            {
                details.concat(project.is_ohd ? [] : [
                    'organization',
                    'job_description',
                    'research_intentions',
                    'specification',
                    'processed_at',
                    'terminated_at',
                ]).map((detail, index) => {
                    let value = data[detail] || userProject?.[detail];
                    if (detail === 'confirmed_at') {
                        value = value ? new Date(value).toLocaleDateString(locale, { dateStyle: 'medium' }) : null;
                    }

                    if (detail === 'job_description' || detail === 'research_intentions') {
                        value = t(`user_project.${detail}.${value}`);
                    }

                    if (detail === 'default_locale') {
                        value = t(value);
                    }

                    return (
                        <p className="detail"
                           key={index}
                          >
                            <span className='name'>{t(`activerecord.attributes.user.${detail}`) + ': '}</span>
                            <span className='content'>{value}</span>
                        </p>
                    )
                })
            }
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


