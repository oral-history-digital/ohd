import { getTranslations } from 'modules/archive';
import { SYSTEM_LOCALES } from 'modules/constants';
import { getCollections, getLanguages, humanReadable } from 'modules/data';
import { useProject } from 'modules/routes';
import { useSelector } from 'react-redux';
import { useMatch } from 'react-router-dom';

/**
 * Formats values using the route locale and loaded project default language.
 * @returns {Object} Localized value formatter.
 */
export function useHumanReadable() {
    const { project } = useProject();
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

    const translations = useSelector(getTranslations);
    const languages = useSelector(getLanguages);
    const collections = useSelector(getCollections);
    const defaultLocale = project?.default_locale;

    const curriedHumanReadable = ({
        obj,
        attribute,
        collapsed,
        none,
        optionsScope,
    }) =>
        humanReadable({
            obj,
            attribute,
            collapsed,
            none,
            translations,
            optionsScope,
            collections,
            languages,
            locale,
            defaultLocale,
        });

    return {
        humanReadable: curriedHumanReadable,
    };
}

export default useHumanReadable;
