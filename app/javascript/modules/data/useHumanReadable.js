import { useMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { SYSTEM_LOCALES, OHD_DOMAINS } from 'modules/constants';
import originalHumanReadable from './humanReadable';
import { getStatuses, getTranslations, getLanguages,
    getCollections } from 'modules/data';

export default function useHumanReadable() {
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
    const translations = useSelector(getTranslations);
    const languages = useSelector(getLanguages);
    const collections = useSelector(getCollections);

    const curriedHumanReadable = ({
        obj,
        attribute,
        collapsed,
        none,
        optionsScope,
    }) => originalHumanReadable({
        obj,
        attribute,
        collapsed,
        none,
        translations,
        statuses,
        optionsScope,
        collections,
        languages,
        locale,
        project,
        dispatch
    });

    return {
        humanReadable: curriedHumanReadable,
    };
}

