import { useEffect, useState } from 'react';

import { institutionsData } from '../dummy-data/institutions_data';

export const useGetInstitutions = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            setData(institutionsData);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    }, []);

    return { data, loading, error };
};
