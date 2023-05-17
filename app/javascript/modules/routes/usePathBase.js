import { useMatch } from 'react-router-dom';

import isLocaleValid from './isLocaleValid';

export default function usePathBase() {
    const matchWithProject = useMatch('/:projectId/:locale/*');
    const matchWOProject = useMatch('/:locale/*');

    if (matchWithProject && isLocaleValid(matchWithProject.params.locale)) {
        return matchWithProject.pathnameBase;
    }
    if (matchWOProject && isLocaleValid(matchWOProject.params.locale)) {
        return matchWOProject.pathnameBase;
    }

    // Return this as a fallback.
    return '/de';
}
