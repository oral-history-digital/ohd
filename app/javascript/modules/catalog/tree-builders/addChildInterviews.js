import keyBy from 'lodash.keyby';

/**
 * IN: interview array, collection
 * OUT: collection
 */

export default function addChildInterviews(interviews, collection) {
    const clonedCollection = {
        ...collection,
        interviews: interviews.filter(interview =>
            interview.collection_id === collection.id),
    };

    return clonedCollection;
}
