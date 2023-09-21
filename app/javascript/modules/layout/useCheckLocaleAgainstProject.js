import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { setLocale } from 'modules/archive';
import { useI18n } from 'modules/i18n';
import { pathBase, useProject } from 'modules/routes';

const MATCH_PATH_BASE_PART = /^(?:\/[\-a-z0-9]{1,11}[a-z])?\/([a-z]{2})(?:\/|$)/;

export default function useCheckLocaleAgainstProject() {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { project, projectId } = useProject();
    const { locale } = useI18n();

    useEffect(() => {
        checkLocaleAgainstProject();
    });

    function checkLocaleAgainstProject() {
        const found = location.pathname.match(MATCH_PATH_BASE_PART);
        const localeFromPath = Array.isArray(found) ? found[1] : null;

        if (!localeFromPath) {
            return;
        }

        // make exception for password paths
        // TODO: removethis exception when all locales are present in OHD
        const password = location.pathname.match(/\/password\//);
        const confirmation = location.pathname.match(/\/confirmation\//);

        if (projectHasLocale(localeFromPath) || password || confirmation) {
            setStateLocaleIfNecessary(localeFromPath);
        } else {
            redirectToDefaultLocale();
        }
    }

    function projectHasLocale(aLocale) {
        return project.available_locales.includes(aLocale);
    }

    function setStateLocaleIfNecessary(newLocale) {
        if (newLocale !== locale) {
            dispatch(setLocale(newLocale));
        }
    }

    function redirectToDefaultLocale() {
        const newPathBase = pathBase({projectId, locale: project.default_locale, project}) + '/';
        const newPath = location.pathname.replace(MATCH_PATH_BASE_PART, newPathBase);
        navigate(newPath, { replace: true });
        dispatch(setLocale(locale));
    }
}
