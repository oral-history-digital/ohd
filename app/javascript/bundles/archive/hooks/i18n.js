import { useSelector } from 'react-redux';

import { t as originalT } from 'lib/utils';
import { getLocale, getTranslations } from 'modules/archive';

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
