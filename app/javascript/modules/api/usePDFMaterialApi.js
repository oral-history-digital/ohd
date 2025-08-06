import { usePathBase } from 'modules/routes';
import fetchHeaders from './fetchHeaders';

export default function usePDFMaterialApi() {
    const pathBase = usePathBase();

    function deletePDFMaterial(archiveId, id) {
        const path = `${pathBase}/interviews/${archiveId}/pdfs/${id}.json`;
        const options = {
            method: 'DELETE',
            headers: fetchHeaders
        };

        return fetch(path, options).then(res => res.json());
    }

    return { deletePDFMaterial };
}
