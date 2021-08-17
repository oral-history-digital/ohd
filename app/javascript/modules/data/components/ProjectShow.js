import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';

import { LinkOrA } from 'modules/routes';
import { getLocale } from 'modules/archive';
import { INDEX_ACCOUNT, setFlyoutTabsIndex } from 'modules/flyout-tabs';

function ProjectShow({
    data,
    hideLogo,
    children
}) {
    const locale = useSelector(getLocale);
    const dispatch = useDispatch();

    const logo = data.logos && Object.values(data.logos).find(l => l.locale === locale);

    const setFlyoutTabsToAccount = () => setFlyoutTabsIndex(INDEX_ACCOUNT);

    return (
        <>
            <LinkOrA project={data} to='' onLinkClick={setFlyoutTabsToAccount} >
                { !hideLogo && <img className="logo-img" src={logo?.src} /> }
                { data.name[locale] }
            </LinkOrA>
            { children }
        </>
    );
}

export default ProjectShow;
