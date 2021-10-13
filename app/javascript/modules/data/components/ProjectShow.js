import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { LinkOrA } from 'modules/routes';
import { getLocale } from 'modules/archive';
import { INDEX_ACCOUNT, setFlyoutTabsIndex } from 'modules/flyout-tabs';

export default function ProjectShow({
    data,
    hideLogo,
    children
}) {
    const locale = useSelector(getLocale);

    const logo = data.logos && Object.values(data.logos).find(l => l.locale === locale);

    const setFlyoutTabsToAccount = () => setFlyoutTabsIndex(INDEX_ACCOUNT);

    return (
        <>
            <LinkOrA
                project={data}
                to=""
                onLinkClick={setFlyoutTabsToAccount}
            >
                {
                    !hideLogo && <img className="logo-img" src={logo?.src} alt="project logo" />
                }
                { data.name[locale] }
            </LinkOrA>
            { children }
        </>
    );
}

ProjectShow.propTypes = {
    data: PropTypes.object.isRequired,
    hideLogo: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};
