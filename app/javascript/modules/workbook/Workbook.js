import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import UserContentsContainer from './UserContentsContainer';

export default function Workbook({
    projectId,
    projects,
    locale,
    account,
    userContentsStatus,
    fetchData,
}) {
    const { t } = useI18n();

    useEffect(() => {
        if (!userContentsStatus && account.email && !account.error) {
            fetchData({ projectId, projects, locale }, 'user_contents');
        }
    }, []);

    return (
        <div>
            <UserContentsContainer
                type='Search'
                title={t('saved_searches')}
            />
            <UserContentsContainer
                type='InterviewReference'
                title={t('saved_interviews')}
            />
            <UserContentsContainer
                type='UserAnnotation'
                title={t('saved_annotations')}
            />
        </div>
    );
}

Workbook.propTypes = {
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    account: PropTypes.object,
    userContentsStatus: PropTypes.object,
    fetchData: PropTypes.func.isRequired,
};
