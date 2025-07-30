import useSWRImmutable from 'swr/immutable';

import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';

export default function usePDFMaterials(interviewId) {
    const pathBase = usePathBase();

    const path = `${pathBase}/interviews/${interviewId}/pdfs.json`;

    const { isLoading, isValidating, data, error } = useSWRImmutable(path, fetcher);

    const formattedData = data ?
        Object.values(data.data) :
        [];

    return { isLoading, isValidating, data: formattedData, error };
}
