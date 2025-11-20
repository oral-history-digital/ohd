import { usePathBase } from 'modules/routes';
import fetchHeaders from './fetchHeaders';

export default function useWorkbookApi() {
    const pathBase = usePathBase();

    function createWorkbookItem(data) {
        const path = `${pathBase}/user_contents.json`;
        const options = {
            method: 'POST',
            headers: fetchHeaders,
            body: JSON.stringify({ user_content: data }),
        };

        return fetch(path, options).then((res) => res.json());
    }

    function updateWorkbookItem(id, data) {
        const path = `${pathBase}/user_contents/${id}.json`;
        const options = {
            method: 'PUT',
            headers: fetchHeaders,
            body: JSON.stringify({ user_content: data }),
        };

        return fetch(path, options).then((res) => res.json());
    }

    function deleteWorkbookItem(id) {
        const path = `${pathBase}/user_contents/${id}.json`;
        const options = {
            method: 'DELETE',
            headers: fetchHeaders,
        };

        return fetch(path, options).then((res) => res.json());
    }

    return {
        createWorkbookItem,
        updateWorkbookItem,
        deleteWorkbookItem,
    };
}
