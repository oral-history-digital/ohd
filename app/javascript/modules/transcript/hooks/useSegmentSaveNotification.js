import { useCallback, useEffect, useState } from 'react';

import { getStatuses } from 'modules/data/redux/selectors/baseSelectors';
import { useI18n } from 'modules/i18n';
import { useSelector } from 'react-redux';

export function useSegmentSaveNotification(segmentId) {
    const { t } = useI18n();
    const statuses = useSelector(getStatuses);
    const segmentSaveStatus = statuses?.segments?.[segmentId];

    const [isSavePending, setIsSavePending] = useState(false);
    const [saveNotification, setSaveNotification] = useState(null);

    useEffect(() => {
        if (!isSavePending || !segmentSaveStatus) return;
        if (segmentSaveStatus === 'fetching') return;

        if (/^fetched/.test(segmentSaveStatus)) {
            setSaveNotification({
                variant: 'success',
                title: t('modules.forms.save_success'),
                autoHideDuration: 1000,
            });
            setIsSavePending(false);
            return;
        }

        if (/^error/.test(segmentSaveStatus)) {
            setSaveNotification({
                variant: 'error',
                title: t('modules.forms.save_error'),
            });
            setIsSavePending(false);
        }
    }, [isSavePending, segmentSaveStatus, t]);

    useEffect(() => {
        setIsSavePending(false);
        setSaveNotification(null);
    }, [segmentId]);

    const handleSaveStart = useCallback(() => {
        setIsSavePending(true);
        setSaveNotification(null);
    }, []);

    const dismissSaveNotification = useCallback(() => {
        setSaveNotification(null);
    }, []);

    return {
        isSaving: segmentSaveStatus === 'fetching',
        saveNotification,
        handleSaveStart,
        dismissSaveNotification,
    };
}
