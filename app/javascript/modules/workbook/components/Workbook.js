import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import UserContents from './UserContents';

export default function Workbook({
    account,
    workbookIsLoading,
    workbookLoaded,
    workbookSearches,
    workbookInterviews,
    workbookAnnotations,
    fetchWorkbook,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();

    useEffect(() => {
        if (account.email && !account.error && !workbookLoaded && !workbookIsLoading) {
            fetchWorkbook(pathBase);
        }
    }, [account.email]);

    if (workbookIsLoading) {
        return <Spinner />;
    }

    return (
        <div>
            <UserContents
                contents={workbookSearches}
                title={t('saved_searches')}
            />
            <UserContents
                contents={workbookInterviews}
                title={t('saved_interviews')}
            />
            <UserContents
                contents={workbookAnnotations}
                title={t('saved_annotations')}
            />
        </div>
    );
}

Workbook.propTypes = {
    account: PropTypes.object,
    workbookIsLoading: PropTypes.bool.isRequired,
    workbookLoaded: PropTypes.bool.isRequired,
    workbookSearches: PropTypes.array,
    workbookInterviews: PropTypes.array,
    workbookAnnotations: PropTypes.array,
    fetchWorkbook: PropTypes.func.isRequired,
};
