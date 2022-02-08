import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { LinkOrA } from 'modules/routes';
import { getLocale } from 'modules/archive';
import { getProjects } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { INDEX_ACCOUNT, setSidebarTabsIndex } from 'modules/sidebar';

export default function InstitutionTile ({
    data,
}) {
    const locale = useSelector(getLocale);
    const projects = useSelector(getProjects);
    const { t } = useI18n();

    const logo = data.logos && Object.values(data.logos).find(l => l.locale === locale);

    const setFlyoutTabsToAccount = () => setSidebarTabsIndex(INDEX_ACCOUNT);

    return (
        <div className="ProjectTile">
            <p className="ProjectTile-text">
                {data.name[locale]}
            </p>
            <img
                className="ProjectTile-image logo-img"
                src={logo?.src}
                alt="Logo"
            />
            <p>
                <h3>{t('activerecord.models.project.other')}</h3>
                {Object.values(data.institution_projects).map(ip => {
                    const project = projects[ip.project_id];
                    return (
                        <LinkOrA
                            project={project}
                            to=""
                            onLinkClick={setFlyoutTabsToAccount}
                        >
                            <p>{project.name[locale]}</p>
                        </LinkOrA>
                    )
                })}
            </p>
            <p>
                <h3>{t('activerecord.models.collection.other')}</h3>
                {data.collections && Object.values(data.collections).map(collection => {
                    return (
                        <LinkOrA
                            project={collection.project}
                            to=""
                            onLinkClick={setFlyoutTabsToAccount}
                        >
                            <p>{collection.name[locale]}</p>
                        </LinkOrA>
                    )
                })}
            </p>
        </div>
    );
}

InstitutionTile.propTypes = {
    data: PropTypes.object.isRequired,
};
