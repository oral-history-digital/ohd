import { useSelector } from 'react-redux';

import { t as originalT } from 'lib/utils';

export function useI18n() {
    const locale = useSelector(state => state.archive.locale);
    const translations = useSelector(state => state.archive.translations);

    const curriedT = (key, params) => originalT({ locale, translations }, key, params);

    return {
        locale,
        translations,
        t: curriedT,
    };
}
