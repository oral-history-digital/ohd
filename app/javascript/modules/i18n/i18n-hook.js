import { useMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { SYSTEM_LOCALES } from 'modules/constants';
import { getTranslationsView } from 'modules/archive';
import { getTranslationValues } from 'modules/data';
import originalT from './t';

export function useI18n() {
    const matchWithProject = useMatch('/:projectId/:locale/*');
    const matchWOProject = useMatch('/:locale/*');

    let locale = 'de';  // de locale is a fallback.

    if (matchWithProject && SYSTEM_LOCALES.includes(matchWithProject.params.locale)) {
        locale = matchWithProject.params.locale;
    } else if (matchWOProject && SYSTEM_LOCALES.includes(matchWOProject.params.locale)) {
        locale = matchWOProject.params.locale;
    }

    const translations = useSelector(getTranslationValues);
    const translationsView = useSelector(getTranslationsView);

    const curriedT = (key, params) => originalT({ locale, translations, translationsView }, key, params);

    return {
        locale,
        translations,
        t: curriedT,
    };
}
