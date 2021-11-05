import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';

import { pathBase } from 'modules/routes';

export default function LocaleButtons({
    currentLocale,
    locales,
    setLocale,
    projectId,
    projects,
}) {
    // do not use usePathBase() here!! we need locale from e.target.testContext!
    //const pathBase = usePathBase();
    //
    const history = useHistory();
    const location = useLocation();

    function handleButtonClick(e) {
        const locale = e.target.textContent;

        let newPath;
        if (/^\/[a-z]{2}\/{0,1}$/.test(location.pathname)) {
            newPath = `/${locale}/`;
        } else {
            newPath = location.pathname.replace(/^(\/[a-z]{2,4}){0,1}\/([a-z]{2})\/*/, pathBase({projectId, locale, projects}) + '/');
        }

        history.push(newPath);
        setLocale(locale);
    }

    return (
        <div className="LocaleButtons">
            {
                locales?.map(locale => (
                    <button
                        key={locale}
                        type="button"
                        className="LocaleButtons-button"
                        disabled={locale === currentLocale}
                        onClick={handleButtonClick}
                    >
                        {locale}
                    </button>
                ))
            }
        </div>
    );
}

LocaleButtons.propTypes = {
    currentLocale: PropTypes.string.isRequired,
    locales: PropTypes.array.isRequired,
    setLocale: PropTypes.func.isRequired,
};
