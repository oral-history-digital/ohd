import { usePathBase } from 'modules/routes';
import fetchHeaders from './fetchHeaders';

export default function useMaterialApi() {
    const pathBase = usePathBase();

    function deleteMaterial(archiveId, id) {
        const path = `${pathBase}/interviews/${archiveId}/materials/${id}.json`;
        const options = {
            method: 'DELETE',
            headers: fetchHeaders
        };

        return fetch(path, options).then(res => res.json());
    }

    return { deleteMaterial };
}
