import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import UserContentsContainer from './UserContentsContainer';

export default function Workbook({
    account,
    workbookIsLoading,
    fetchWorkbook,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();

    useEffect(() => {
        if (account.email && !account.error) {
            fetchWorkbook(pathBase);
        }
    }, [account.email]);

    if (workbookIsLoading) {
        return <Spinner />;
    }

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
    account: PropTypes.object,
    workbookIsLoading: PropTypes.bool.isRequired,
    fetchWorkbook: PropTypes.func.isRequired,
};
