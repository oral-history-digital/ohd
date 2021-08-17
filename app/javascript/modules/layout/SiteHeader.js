import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import OHDLink from './OHDLink';

import { getCurrentProject } from 'modules/data';
import { getLocale } from 'modules/archive';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';

function SiteHeader() {
    const locale = useSelector(getLocale);
    const pathBase = usePathBase();
    const project = useSelector(getCurrentProject);
    const logos = project?.logos;
    const { t } = useI18n();

    let src = null;
    if (logos) {
        Object.keys(logos).map(k => {
            if (logos[k].locale === locale) {
                src = logos[k].src
            }
        })
        src = src || (logos[0]?.src);
    }

    return (
        <header className="SiteHeader">
            <OHDLink />
            <Link
                to={pathBase}
                className="logo-link"
                title={t('home')}
            >
                <img className="logo-img" src={src}/>
            </Link>
        </header>
    );
}

export default SiteHeader;
