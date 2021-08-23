import { useSelector } from 'react-redux';
mport { useParams } from "react-router";

import { getCurrentProject } from 'modules/data';
import { getLocale, setLocale } from 'modules/archive';
import { usePathBase } from 'modules/routes';

function InitialLocaleSetter() {
    let { locale } = useParams();
    const locale = useSelector(getLocale);
    const pathBase = usePathBase();
    const project = useSelector(getCurrentProject);

    return (null);
}

export default SiteHeader;
