import curry from 'lodash.curry';

import mapInterview from './mapInterview';
import rowComparator from '../rowComparator';

export default function mapCollection(locale, collection) {
    const curriedMapInterview = curry(mapInterview)(locale);

    return {
        type: 'collection',
        id: collection.id,
        name: collection.name[locale],
        num_interviews: collection.num_interviews,
        subRows: collection.interviews
            ?.map(curriedMapInterview)
            ?.sort(rowComparator),
    };
}
