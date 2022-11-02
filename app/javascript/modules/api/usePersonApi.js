import { usePathBase } from 'modules/routes';
import fetchHeaders from './fetchHeaders';

export default function usePersonApi() {
    const pathBase = usePathBase();

    function deletePerson(id) {
        const path = `${pathBase}/people/${id}.json`;
        const options = {
            method: 'DELETE',
            headers: fetchHeaders
        };

        return fetch(path, options).then(res => res.json());
    }

    return {
        deletePerson,
    };
}
