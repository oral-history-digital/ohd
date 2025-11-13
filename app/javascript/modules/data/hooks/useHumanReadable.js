import { useSelector } from 'react-redux';

import { SYSTEM_LOCALES, OHD_DOMAINS } from 'modules/constants';
import originalHumanReadable from '../utils/humanReadable';
import { getLanguages, getCollections } from 'modules/data';
import { getTranslations } from 'modules/archive';

export function useHumanReadable(locale) {
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
        optionsScope,
        collections,
        languages,
        locale,
    });

    return {
        humanReadable: curriedHumanReadable,
    };
}

export default useHumanReadable;
