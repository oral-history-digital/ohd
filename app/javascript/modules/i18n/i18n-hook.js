import { useSelector } from 'react-redux';

import { getLocale, getTranslations } from 'modules/archive';
import originalT from './t';

export function useI18n() {
    const locale = useSelector(getLocale);
    const translations = useSelector(getTranslations);

    const curriedT = (key, params) => originalT({ locale, translations }, key, params);

    return {
        locale,
        translations,
        t: curriedT,
    };
}
