import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { LinkOrA } from 'modules/routes';
import { getLocale } from 'modules/archive';
import { INDEX_ACCOUNT, setFlyoutTabsIndex } from 'modules/flyout-tabs';

export default function ProjectTile({
    data,
}) {
    const locale = useSelector(getLocale);

    const logo = data.logos && Object.values(data.logos).find(l => l.locale === locale);

    const setFlyoutTabsToAccount = () => setFlyoutTabsIndex(INDEX_ACCOUNT);

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
                alt="project logo"
            />
            <div className="ProjectTile-text">
                {data.name[locale]}
            </div>
        </LinkOrA>
    );
}

ProjectTile.propTypes = {
    data: PropTypes.object.isRequired,
};
