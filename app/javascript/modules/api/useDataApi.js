import { usePathBase } from 'modules/routes';

import fetchHeaders from './fetchHeaders';

export default function useDataApi() {
    const pathBase = usePathBase();

    function deleteDatum(id, scope) {
        const path = `${pathBase}/${scope}/${id}.json`;
        const options = {
            method: 'DELETE',
            headers: fetchHeaders,
        };

        return fetch(path, options).then((res) => res.json());
    }

    return {
        deleteDatum,
    };
}
