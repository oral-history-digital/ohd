import { useEffect, useState } from 'react';

import { archivesData } from '../dummy-data/archives_data';

export const useGetArchives = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            setData(archivesData);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    }, []);

    return { data, loading, error };
};
