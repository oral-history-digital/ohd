import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { getLocale, setProjectId } from 'modules/archive';

function ProjectShow({data}) {
    const locale = useSelector(getLocale);

    return (
        <Link
            onClick={() => setProjectId(data.identifier)}
            to={`/${data.identifier}/${locale}/`}
        >
            {data.name[locale]}
        </Link>
    );
}

export default ProjectShow;
