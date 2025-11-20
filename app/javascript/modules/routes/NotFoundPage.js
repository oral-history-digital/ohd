import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import { useI18n } from 'modules/i18n';
import usePathBase from './usePathBase';

export default function NotFoundPage() {
    const { t } = useI18n();
    const pathBase = usePathBase();

    return (
        <div className="wrapper-content register">
            <Helmet>
                <title>{t('modules.routes.not_found.title')}</title>
            </Helmet>
            <h1>{t('modules.routes.not_found.title')}</h1>
            <p className="Paragraph">
                {t('modules.routes.not_found.description')}
            </p>
            <p className="Paragraph">
                <Link to={`${pathBase}`}>
                    {t('modules.routes.not_found.link')}
                </Link>
            </p>
        </div>
    );
}
