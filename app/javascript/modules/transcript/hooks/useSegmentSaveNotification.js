import { useCallback, useEffect, useState } from 'react';

import { getStatuses } from 'modules/data/redux/selectors/baseSelectors';
import { useI18n } from 'modules/i18n';
import { useSelector } from 'react-redux';

export function useSegmentSaveNotification(segmentId) {
    const { t } = useI18n();
    const statuses = useSelector(getStatuses);
    const segmentSaveStatus = statuses?.segments?.[segmentId];
    const globalSegmentSaveStatus = statuses?.segments?.all;

    const [isSavePending, setIsSavePending] = useState(false);
    const [saveNotification, setSaveNotification] = useState(null);

    // Track scope of save status (segment-specific or global, like "all" when using
    // POST to add a new segment) to determine which status to monitor for changes.
    const [saveStatusScope, setSaveStatusScope] = useState(null);
    useEffect(() => {
        if (!isSavePending) return;

        if (!saveStatusScope) {
            if (segmentSaveStatus === 'fetching') {
                setSaveStatusScope('segment');
                return;
            }

            if (globalSegmentSaveStatus === 'fetching') {
                setSaveStatusScope('global');
            }
            return;
        }

        const scopedStatus =
            saveStatusScope === 'segment'
                ? segmentSaveStatus
                : globalSegmentSaveStatus;

        if (!scopedStatus || scopedStatus === 'fetching') return;

        if (/^fetched/.test(scopedStatus)) {
            setSaveNotification({
                variant: 'success',
                title: t('modules.forms.save_success'),
                autoHideDuration: 1000,
            });
            setIsSavePending(false);
            setSaveStatusScope(null);
            return;
        }

        if (/^error/.test(scopedStatus)) {
            setSaveNotification({
                variant: 'error',
                title: t('modules.forms.save_error'),
            });
            setIsSavePending(false);
            setSaveStatusScope(null);
        }
    }, [
        globalSegmentSaveStatus,
        isSavePending,
        saveStatusScope,
        segmentSaveStatus,
        t,
    ]);

    useEffect(() => {
        setIsSavePending(false);
        setSaveStatusScope(null);
        setSaveNotification(null);
    }, [segmentId]);

    const handleSaveStart = useCallback(() => {
        setIsSavePending(true);
        setSaveStatusScope(null);
        setSaveNotification(null);
    }, []);

    const isSaving =
        isSavePending &&
        (saveStatusScope === 'segment'
            ? segmentSaveStatus === 'fetching'
            : saveStatusScope === 'global'
              ? globalSegmentSaveStatus === 'fetching'
              : segmentSaveStatus === 'fetching' ||
                globalSegmentSaveStatus === 'fetching');

    const dismissSaveNotification = useCallback(() => {
        setSaveNotification(null);
    }, []);

    return {
        isSaving,
        saveNotification,
        handleSaveStart,
        dismissSaveNotification,
    };
}
