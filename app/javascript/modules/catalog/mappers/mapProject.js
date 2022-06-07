import curry from 'lodash.curry';

import mapCollection from './mapCollection';
import rowComparator from '../rowComparator';

export default function mapProject(locale, project) {
    const curriedMapCollection = curry(mapCollection)(locale);

    return {
        type: 'project',
        id: project.id,
        shortname: project.shortname,
        name: project.name[locale],
        num_interviews: project.num_interviews,
        subRows: project.collections
            .map(curriedMapCollection)
            .sort(rowComparator),
    };
}
