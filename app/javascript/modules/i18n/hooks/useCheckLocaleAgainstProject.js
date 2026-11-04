import { useEffect } from 'react';

import { fetchTranslationsForLocale, setLocale } from 'modules/archive';
import { useI18n } from 'modules/i18n';
import { usePathBase, useProject } from 'modules/routes';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const MATCH_PATH_BASE_PART = /^(?:\/[a-z0-9-]{1,11}[a-z])?\/([a-z]{2})(?:\/|$)/;

/**
 * Applies loaded project locale settings while preserving account/legal page locale exceptions.
 * Locale redirects keep the current project/domain route and query string.
 */
export function useCheckLocaleAgainstProject() {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { project, isLoading, error } = useProject();
    const routeBase = usePathBase();
    const { locale } = useI18n();

    useEffect(() => {
        if (
            isLoading ||
            error ||
            !project?.available_locales ||
            !project.default_locale
        ) {
            return;
        }

        checkLocaleAgainstProject();
    }, [project, isLoading, error, routeBase, locale, location.pathname]);

    function checkLocaleAgainstProject() {
        const found = location.pathname.match(MATCH_PATH_BASE_PART);
        const localeFromPath = Array.isArray(found) ? found[1] : null;

        if (!localeFromPath) {
            return;
        }

        // Allow account and legal pages independently of the current project's locales.
        // TODO: Remove this exception when all locales are present
        const password = location.pathname.match(/\/password\//);
        const confirmation = location.pathname.match(/\/confirmation\/?$/);
        const registration = location.pathname.match(/\/register\/?$/);
        const conditions = location.pathname.match(/\/conditions$/);
        const privacy_protection = location.pathname.match(
            /\/privacy_protection$/
        );

        if (
            projectHasLocale(localeFromPath) ||
            password ||
            conditions ||
            privacy_protection ||
            confirmation ||
            registration
        ) {
            setStateLocaleIfNecessary(localeFromPath);
        } else {
            redirectToDefaultLocale();
        }
    }

    function projectHasLocale(aLocale) {
        return project?.available_locales?.includes(aLocale) || false;
    }

    function setStateLocaleIfNecessary(newLocale) {
        if (newLocale !== locale) {
            dispatch(setLocale(newLocale));
        }
    }

    function redirectToDefaultLocale() {
        if (!project?.default_locale) {
            return;
        }

        const newPathBase = routeBase.replace(
            /\/[a-z]{2}$/,
            `/${project.default_locale}`
        );
        const newPath = location.pathname.replace(
            MATCH_PATH_BASE_PART,
            newPathBase + '/'
        );

        dispatch(setLocale(project.default_locale));
        dispatch(
            fetchTranslationsForLocale(project.default_locale, newPathBase)
        )
            .then(() => {
                // Only navigate and set locale after translations are loaded
                navigate(newPath + location.search, { replace: true });
            })
            .catch((error) => {
                console.error(
                    'Failed to load translations for locale change:',
                    error
                );
            });
    }
}
