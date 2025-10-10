import { useSelector } from 'react-redux';

import { SYSTEM_LOCALES, OHD_DOMAINS } from 'modules/constants';
import originalT from './t';
import { getTranslationsView, getTranslations } from 'modules/archive';

export function useI18n() {
    const locale = useSelector(state => state.archive.locale);

    const translations = useSelector(getTranslations);
    const translationsView = useSelector(getTranslationsView);

    const curriedT = (key, params) => originalT({
        locale,
        translations,
        translationsView,
    }, key, params);

    return {
        locale,
        t: curriedT,
    };
}
