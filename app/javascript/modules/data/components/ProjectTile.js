import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { LinkOrA } from 'modules/routes';
import { getLocale } from 'modules/archive';
import { INDEX_ACCOUNT, setSidebarTabsIndex } from 'modules/sidebar';

export default function ProjectTile({
    data,
}) {
    const locale = useSelector(getLocale);

    const logo = data.logos && Object.values(data.logos).find(l => l.locale === locale);

    const setFlyoutTabsToAccount = () => setSidebarTabsIndex(INDEX_ACCOUNT);

    return (
        <LinkOrA
            className="ProjectTile"
            project={data}
            to=""
            onLinkClick={setFlyoutTabsToAccount}
        >
            <img
                className="ProjectTile-image logo-img"
                src={logo?.src}
                alt="Logo"
            />
            <div className="ProjectTile-body">
                <p className="ProjectTile-text">
                    {data.name[locale]}
                </p>
                <p className="ProjectTile-text ProjectTile-text--small">
                    {data.hosting_institution}
                </p>
            </div>
        </LinkOrA>
    );
}

ProjectTile.propTypes = {
    data: PropTypes.object.isRequired,
};
