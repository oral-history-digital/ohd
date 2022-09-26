import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useLocation, useNavigate } from 'react-router-dom';

import { pathBase } from 'modules/routes';

export default function LocaleButtons({
    className,
    currentLocale,
    locales,
    setLocale,
    projectId,
    projects,
}) {
    const location = useLocation();
    const navigate = useNavigate();

    function handleButtonClick(e) {
        const locale = e.target.textContent;

        const pathBaseStr = pathBase({ projectId, locale, projects });

        let newPath;
        if (/^\/[a-z]{2}\/?$/.test(location.pathname)) {
            newPath = `/${locale}`;
        } else if (/^(?:\/[a-z]{2,4})?\/[a-z]{2}$/.test(location.pathname)) {
            newPath = pathBaseStr;
        } else {
            newPath = location.pathname.replace(/^(?:\/[a-z]{2,4})?\/[a-z]{2}\//, pathBaseStr + '/');
        }

        navigate(newPath);
        setLocale(locale);
    }

    return (
        <div className={classNames('LocaleButtons', className)}>
            {
                locales?.map(locale => (
                    <button
                        key={locale}
                        type="button"
                        className="Button LocaleButtons-button"
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
    className: PropTypes.string,
    currentLocale: PropTypes.string.isRequired,
    locales: PropTypes.array.isRequired,
    projectId: PropTypes.string,
    projects: PropTypes.object.isRequired,
    setLocale: PropTypes.func.isRequired,
};
