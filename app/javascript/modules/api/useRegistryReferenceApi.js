import { usePathBase } from 'modules/routes';
import fetchHeaders from './fetchHeaders';

export default function useRegistryReferenceApi() {
    const pathBase = usePathBase();

    function createRegistryReference(data) {
        const path = `${pathBase}/registry_references.json`;
        const options = {
            method: 'POST',
            headers: fetchHeaders,
            body: JSON.stringify({ registry_reference: data })
        };

        return fetch(path, options).then(res => res.json());
    }

    function updateRegistryReference(id, data) {
        const path = `${pathBase}/registry_references/${id}.json`;
        const options = {
            method: 'PUT',
            headers: fetchHeaders,
            body: JSON.stringify({ registry_reference: data })
        };

        return fetch(path, options).then(res => res.json());
    }

    function deleteRegistryReference(id) {
        const path = `${pathBase}/registry_references/${id}.json`;
        const options = {
            method: 'DELETE',
            headers: fetchHeaders
        };

        return fetch(path, options).then(res => res.json());
    }

    return {
        createRegistryReference,
        updateRegistryReference,
        deleteRegistryReference
    };
}
