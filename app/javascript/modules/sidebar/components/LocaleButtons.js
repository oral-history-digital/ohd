import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useNavigate, useMatch, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { DEFAULT_LOCALES, SYSTEM_LOCALES } from 'modules/constants';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { setLocale } from 'modules/archive';
import { ALPHA2_TO_ALPHA3 } from 'modules/constants';

const projectLocales = (project) => project ?
    project.available_locales :
    DEFAULT_LOCALES;

export default function LocaleButtons({ className }) {
    const dispatch = useDispatch();
    const { project } = useProject();
    const locales = projectLocales(project);
    const { locale: currentLocale } = useI18n();
    const navigate = useNavigate();
    const matchWithProject = useMatch('/:projectId/:locale/*');
    const matchWOProject = useMatch('/:locale/*');
    const [searchParams, setSearchParams] = useSearchParams();

    function handleButtonClick(e) {
        const locale = e.target.value;

        let pathBaseStr = '/de';  // Fallback.
        let newPath;
        if (matchWithProject && SYSTEM_LOCALES.includes(matchWithProject.params.locale)) {
            pathBaseStr = `/${matchWithProject.params.projectId}/${locale}`;
            if (matchWithProject.params['*']) {
                newPath = pathBaseStr + '/' + matchWithProject.params['*'];
            } else {
                newPath = pathBaseStr;
            }
        }
        if (matchWOProject && SYSTEM_LOCALES.includes(matchWOProject.params.locale)) {
            pathBaseStr = `/${locale}`;
            if (matchWOProject.params['*']) {
                newPath = pathBaseStr + '/' + matchWOProject.params['*'];
            } else {
                newPath = pathBaseStr;
            }
        }

        // Add query params.
        const queryString = searchParams.toString();
        if (queryString.length > 0) {
            newPath += `?${queryString}`;
        }

        navigate(newPath);
        dispatch(setLocale(locale));
    }

    return (
        <div className={classNames('LocaleButtons', className)}>
            {
                locales?.map(locale => (
                    <button
                        key={locale}
                        value={locale}
                        type="button"
                        className="Button LocaleButtons-button"
                        disabled={locale === currentLocale}
                        onClick={handleButtonClick}
                    >
                        {ALPHA2_TO_ALPHA3[locale]}
                    </button>
                ))
            }
        </div>
    );
}

LocaleButtons.propTypes = {
    className: PropTypes.string,
};
