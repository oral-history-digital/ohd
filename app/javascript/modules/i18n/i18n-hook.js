import { getTranslations, getTranslationsView } from 'modules/archive';
import { SYSTEM_LOCALES } from 'modules/constants';
import { useSelector } from 'react-redux';
import { useMatch } from 'react-router-dom';

import originalT from './t';
import { isRtlLanguage } from './utils';

export function useI18n() {
    const matchWithProject = useMatch('/:projectId/:locale/*');
    const matchWOProject = useMatch('/:locale/*');

    let locale = 'de'; // de locale is a fallback.

    if (
        matchWithProject &&
        SYSTEM_LOCALES.includes(matchWithProject.params.locale)
    ) {
        locale = matchWithProject.params.locale;
    } else if (
        matchWOProject &&
        SYSTEM_LOCALES.includes(matchWOProject.params.locale)
    ) {
        locale = matchWOProject.params.locale;
    }

    const rtl = isRtlLanguage(locale);
    const textDirection = rtl ? 'rtl' : 'ltr';

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
        isRtlLanguage: rtl,
        textDirection,
    };
}
