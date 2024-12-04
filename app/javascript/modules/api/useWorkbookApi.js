import { usePathBase } from 'modules/routes';
import fetchHeaders from './fetchHeaders';

export default function useWorkbookApi() {
    const pathBase = usePathBase();

    function deleteWorkbookItem(id) {
        const path = `${pathBase}/user_contents/${id}.json`;
        const options = {
            method: 'DELETE',
            headers: fetchHeaders
        };

        return fetch(path, options).then(res => res.json());
    }

    return {
        deleteWorkbookItem,
    };
}
