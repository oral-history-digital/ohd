import { useMemo } from 'react';

import { useI18n } from 'modules/i18n';

/**
 * Hook to build the tabs array for segment editing based on authorization.
 *
 * Returns an array of tab objects with id and label properties.
 *
 * @param {boolean} showEditTab - Whether edit tab should be shown
 * @param {boolean} showHeadingsTab - Whether headings tab should be shown
 * @param {boolean} showAnnotationsTab - Whether annotations tab should be shown
 * @param {boolean} showReferencesTab - Whether registry references tab should be shown
 * @returns {array} Array of tab objects
 */
export function useSegmentTabs(
    showEditTab,
    showHeadingsTab,
    showAnnotationsTab,
    showReferencesTab
) {
    const { t } = useI18n();

    return useMemo(() => {
        const tabsArray = [];
        if (showEditTab) {
            tabsArray.push({
                id: 'edit',
                label: t('edit.segment.tab_edit'),
            });
        }
        if (showHeadingsTab) {
            tabsArray.push({
                id: 'headings',
                label: t('edit.segment.tab_headings'),
            });
        }
        if (showAnnotationsTab) {
            tabsArray.push({
                id: 'annotations',
                label: t('edit.segment.tab_annotations'),
            });
        }
        if (showReferencesTab) {
            tabsArray.push({
                id: 'references',
                label: t('edit.segment.tab_registry_references'),
            });
        }
        return tabsArray;
    }, [
        showEditTab,
        showAnnotationsTab,
        showReferencesTab,
        showHeadingsTab,
        t,
    ]);
}
