import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { getLocale, setProjectId } from 'modules/archive';

function ProjectShow({
    data,
    children
}) {
    const locale = useSelector(getLocale);

    const logo = data.logos && Object.values(data.logos).find(l => l.locale === locale);
    const href = data.archive_domain ? `${data.archive_domain}/${locale}/` : `/${data.identifier}/${locale}/`;

    return (
        <>
            <a
                href={href}
            >
                <img className="logo-img" src={logo?.src} />
                { data.name[locale] }
            </a>
            { children }
        </>
    );
}

export default ProjectShow;
