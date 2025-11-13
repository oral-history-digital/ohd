import { useSelector } from 'react-redux';

import { getTranslations, getTranslationsView } from 'modules/archive';
import originalT from './t';

export function useI18n() {
    const locale = useSelector(state => state.archive.locale);

    const translations = useSelector(getTranslations);
    const translationsView = useSelector(getTranslationsView);

    const curriedT = (key, params) =>
        originalT(
            {
                locale,
                translations,
                translationsView,
            },
            key,
            params
        );

    return {
        locale,
        t: curriedT,
    };
}
