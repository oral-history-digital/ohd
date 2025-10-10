import { useSelector } from 'react-redux';

import isLocaleValid from './isLocaleValid';
import { getCurrentProject } from 'modules/data';
import pathBase from './pathBase';

export default function usePathBase() {
    const project = useSelector(getCurrentProject);
    const locale = useSelector(state => state.archive.locale);

    return pathBase({ project, locale: isLocaleValid(locale) ? locale : 'de' });
}
