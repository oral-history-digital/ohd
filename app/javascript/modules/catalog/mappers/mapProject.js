import curry from 'lodash.curry';

import rowComparator from '../rowComparator';
import mapCollection from './mapCollection';

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
