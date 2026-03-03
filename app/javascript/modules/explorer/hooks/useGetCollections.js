import { useEffect, useState } from 'react';

import { collectionsData } from '../dummy-data/collections_data';

export const useGetCollections = (archiveId) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            const filteredCollections = archiveId
                ? collectionsData.filter((col) => col.project_id === archiveId)
                : collectionsData;
            setData(filteredCollections);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    }, [archiveId]);

    return { collections: data, loading, error };
};
