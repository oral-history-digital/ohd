import { useMemo } from 'react';

import { useI18n } from 'modules/i18n';

import { buildListCountMeta } from '../utils';

/**
 * Returns a translated list count label, with total in parentheses when filtered.
 *
 * @param {Object} params
 * @param {'archives'|'institutions'} params.scope
 * @param {Array|number|null|undefined} params.displayedItems
 * @param {Array|number|null|undefined} params.totalItems
 * @returns {string}
 */
export function useExplorerListCountLabel({
    scope,
    displayedItems,
    totalItems,
    showTotals = true,
}) {
    const { t } = useI18n();

    return useMemo(() => {
        const { count, total, hasActiveFilter } = buildListCountMeta(
            displayedItems,
            totalItems
        );

        const keyBase = `explorer.${scope}_list`;
        const key =
            hasActiveFilter && showTotals
                ? `${keyBase}.count_with_total`
                : `${keyBase}.count`;

        return t(key, { count, total });
    }, [displayedItems, scope, t, totalItems, showTotals]);
}
