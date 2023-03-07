import { useSelector } from 'react-redux';

import UserFormContainer from './UserFormContainer';
import { useI18n } from 'modules/i18n';
import { getCurrentProject } from 'modules/data';

export default function UserEdit ({
    data,
    onSubmit,
}) {

    const { t } = useI18n();
    const project = useSelector(getCurrentProject);
    const scope = project.shortname === 'ohd' ? 'user_registration' : 'user_registration_project';
    const userRegistrationProject = Object.values(data.user_registration_projects).find(urp => urp.project_id === project.id);

    return (
        <div className='details'>
            {
                [
                    'appellation',
                    'first_name',
                    'last_name',
                    'email',
                    'street',
                    'zipcode',
                    'city',
                    'country',
                    'gender',
                    'organization',
                    'job_description',
                    'research_intentions',
                    'comments',
                    'activated_at',
                    'processed_at',
                    'terminated_at',
                    'default_locale',
                ].map((detail, index) => {
                    return (
                        <p className="detail"
                           key={index}
                          >
                            <span className='name'>{t(`activerecord.attributes.user_registration.${detail}`) + ': '}</span>
                            <span className='content'>{data[detail] || userRegistrationProject[detail]}</span>
                        </p>
                    )
                })
            }
            <UserFormContainer
                data={project.shortname === 'ohd' ? data : userRegistrationProject}
                userRegistrationId={data.id}
                scope={scope}
                onSubmit={onSubmit}
            />
        </div>
    );
}


