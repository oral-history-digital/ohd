import { useState } from 'react';

import classNames from 'classnames';
import { fetchTranslationsForLocale, setLocale } from 'modules/archive';
import { ALPHA2_TO_ALPHA3, SYSTEM_LOCALES } from 'modules/constants';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useMatch, useNavigate, useSearchParams } from 'react-router-dom';

/**
 * Switches among project locales after loading the destination UI translations.
 *
 * @param {Object} props - Locale control properties.
 * @param {string} [props.className] - Additional wrapper classes.
 * @returns {React.ReactElement|null} Locale controls or error; empty while loading.
 */
export default function LocaleButtons({ className }) {
    const dispatch = useDispatch();
    const { project, isLoading, error } = useProject();
    const { t, locale: currentLocale } = useI18n();
    const navigate = useNavigate();
    const matchWithProject = useMatch('/:projectId/:locale/*');
    const matchWOProject = useMatch('/:locale/*');
    const [searchParams] = useSearchParams();
    const [loadingLocale, setLoadingLocale] = useState(null);

    if (error) {
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );
    }
    if (isLoading || !project) return null;

    function handleButtonClick(locale) {
        // Prevent multiple clicks while loading
        if (loadingLocale || !locale) return;

        setLoadingLocale(locale);

        // Build the pathBase for the new locale
        let pathBase = `/${locale}`; // Default fallback
        let newPath = pathBase;

        if (
            matchWithProject &&
            SYSTEM_LOCALES.includes(matchWithProject.params.locale)
        ) {
            pathBase = `/${matchWithProject.params.projectId}/${locale}`;
            if (matchWithProject.params['*']) {
                newPath = pathBase + '/' + matchWithProject.params['*'];
            } else {
                newPath = pathBase;
            }
        } else if (
            matchWOProject &&
            SYSTEM_LOCALES.includes(matchWOProject.params.locale)
        ) {
            pathBase = `/${locale}`;
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
        dispatch(fetchTranslationsForLocale(locale, pathBase))
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
            })
            .finally(() => {
                setLoadingLocale(null);
            });
    }

    return (
        <div className={classNames('LocaleButtons', className)}>
            {project.available_locales?.map((locale) => (
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
                        {loadingLocale === locale && <Spinner size={24} />}
                    </span>
                </button>
            ))}
        </div>
    );
}

LocaleButtons.propTypes = {
    className: PropTypes.string,
};
