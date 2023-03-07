import { useSelector } from 'react-redux';

import UserRegistrationProjectFormContainer from './UserRegistrationProjectFormContainer';
import { useI18n } from 'modules/i18n';
import { getCurrentProject } from 'modules/data';

export default function UserEdit ({
    data,
    onSubmit,
}) {

    const { t } = useI18n();
    const project = useSelector(getCurrentProject);
    const userRegistrationProject = Object.values(data.user_registration_projects).find(urp => urp.project_id === project.id);

    return (
        <div className='details'>
            {
                [
                    'appellation',
                    'first_name',
                    'last_name',
                    'email',
                    'gender',
                    'job_description',
                    'research_intentions',
                    'comments',
                    'organization',
                    'homepage',
                    'street',
                    'zipcode',
                    'city',
                    'country',
                    'created_at',
                    'activated_at',
                    'processed_at',
                    'default_locale',
                    'receive_newsletter',
                    'workflow_state'
                ].map((detail, index) => {
                    return (
                        <p className="detail"
                           key={index}
                          >
                            <span className='name'>{t(`activerecord.attributes.user_registration.${detail}`) + ': '}</span>
                            <span className='content'>{data[detail]}</span>
                        </p>
                    )
                })
            }
            <UserRegistrationProjectFormContainer
                userRegistrationProject={userRegistrationProject}
                onSubmit={onSubmit}
            />
        </div>
    );
}


