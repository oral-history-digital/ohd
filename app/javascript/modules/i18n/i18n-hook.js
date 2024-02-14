import { useMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { SYSTEM_LOCALES, OHD_DOMAINS } from 'modules/constants';
import originalT from './t';
import { getStatuses, getTranslationValues } from 'modules/data';
import { getTranslationsView } from 'modules/archive';

export function useI18n() {
    const matchWithProject = useMatch('/:projectId/:locale/*');
    const matchWOProject = useMatch('/:locale/*');

    let locale = 'de';  // de locale is a fallback.

    if (matchWithProject && SYSTEM_LOCALES.includes(matchWithProject.params.locale)) {
        locale = matchWithProject.params.locale;
    } else if (matchWOProject && SYSTEM_LOCALES.includes(matchWOProject.params.locale)) {
        locale = matchWOProject.params.locale;
    }

    const project = { shortname: 'ohd', archive_domain: OHD_DOMAINS[railsMode] };
    const dispatch = useDispatch();
    const statuses = useSelector(getStatuses);
    const translationValues = useSelector(getTranslationValues);
    const translationsView = useSelector(getTranslationsView);

    const curriedT = (key, params) => originalT({
        locale,
        translationValues,
        statuses,
        project,
        translationsView,
        dispatch
    }, key, params);

    return {
        locale,
        t: curriedT,
    };
}
