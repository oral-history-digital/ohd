import PropTypes from 'prop-types';
import classNames from 'classnames';
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

    function handleButtonClick(e) {
        const locale = e.target.value;
        const newPath = location.pathname.replace(`/${currentLocale}`, `/${locale}`);

        location = newPath;
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
