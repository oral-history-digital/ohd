import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useMatch, useNavigate, useSearchParams } from 'react-router-dom';

import { fetchTranslationsForLocale, setLocale } from 'modules/archive';
import {
    ALPHA2_TO_ALPHA3,
    DEFAULT_LOCALES,
    SYSTEM_LOCALES,
} from 'modules/constants';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';

const projectLocales = (project) =>
    project ? project.available_locales : DEFAULT_LOCALES;

export default function LocaleButtons({ className }) {
    const dispatch = useDispatch();
    const { project } = useProject();
    const locales = projectLocales(project);
    const { locale: currentLocale } = useI18n();
    const navigate = useNavigate();
    const matchWithProject = useMatch('/:projectId/:locale/*');
    const matchWOProject = useMatch('/:locale/*');
    const [searchParams] = useSearchParams();
    const [loadingLocale, setLoadingLocale] = useState(null);

    function handleButtonClick(locale) {
        // Prevent multiple clicks while loading
        if (loadingLocale || !locale) return;

        setLoadingLocale(locale);

        let newPath = `/${locale}`; // Default fallback path

        if (
            matchWithProject &&
            SYSTEM_LOCALES.includes(matchWithProject.params.locale)
        ) {
            const pathBase = `/${matchWithProject.params.projectId}/${locale}`;
            if (matchWithProject.params['*']) {
                newPath = pathBase + '/' + matchWithProject.params['*'];
            } else {
                newPath = pathBase;
            }
        } else if (
            matchWOProject &&
            SYSTEM_LOCALES.includes(matchWOProject.params.locale)
        ) {
            const pathBase = `/${locale}`;
            if (matchWOProject.params['*']) {
                newPath = pathBase + '/' + matchWOProject.params['*'];
            } else {
                newPath = pathBase;
            }
        }

        // Add query params.
        const queryString = searchParams.toString();
        if (queryString.length > 0) {
            newPath += `?${queryString}`;
        }

        // First fetch translations for the new locale, then change locale
        const projectId = project?.shortname;
        dispatch(fetchTranslationsForLocale(locale, projectId))
            .then(() => {
                // Only navigate and set locale after translations are loaded
                navigate(newPath);
                dispatch(setLocale(locale));
            })
            .catch((error) => {
                console.error(
                    'Failed to load translations for locale change:',
                    error
                );
                // Still allow locale change even if translations fail
                navigate(newPath);
                dispatch(setLocale(locale));
            })
            .finally(() => {
                setLoadingLocale(null);
            });
    }

    return (
        <div className={classNames('LocaleButtons', className)}>
            {locales?.map((locale) => (
                <button
                    key={locale}
                    type="button"
                    className="Button LocaleButtons-button"
                    disabled={
                        locale === currentLocale || loadingLocale !== null
                    }
                    onClick={() => handleButtonClick(locale)}
                >
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                        }}
                    >
                        {ALPHA2_TO_ALPHA3[locale]}
                        {loadingLocale === locale && <Spinner small />}
                    </span>
                </button>
            ))}
        </div>
    );
}

LocaleButtons.propTypes = {
    className: PropTypes.string,
};
