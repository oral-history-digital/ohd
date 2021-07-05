import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';

import { getLocale, setProjectId } from 'modules/archive';
import { INDEX_ACCOUNT, setFlyoutTabsIndex } from 'modules/flyout-tabs';

function ProjectShow({
    data,
    hideLogo,
    children
}) {
    const locale = useSelector(getLocale);
    const dispatch = useDispatch();

    const logo = data.logos && Object.values(data.logos).find(l => l.locale === locale);

    const doSetProjectId = useCallback(
        () => dispatch(setProjectId(data.identifier)),
        [dispatch]
    )

    const doSetFlyoutTabsIndex = useCallback(
        () => dispatch(setFlyoutTabsIndex(INDEX_ACCOUNT)),
        [dispatch]
    )

    return (
        data.archive_domain ?
            <>
                <a href={`${data.archive_domain}/${locale}/`} >
                    { !hideLogo && <img className="logo-img" src={logo?.src} /> }
                    { data.name[locale] }
                </a>
                { children }
            </> :
            <>
                <Link
                    to={`/${data.identifier}/${locale}/`}
                    onClick={ () => { doSetProjectId(); doSetFlyoutTabsIndex()} }
                >
                    { !hideLogo && <img className="logo-img" src={logo?.src} /> }
                    { data.name[locale] }
                </Link>
                { children }
            </>
    );
}

export default ProjectShow;
