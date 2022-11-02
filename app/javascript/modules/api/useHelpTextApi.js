import { usePathBase } from 'modules/routes';
import fetchHeaders from './fetchHeaders';

export default function useHelpTextApi() {
    const pathBase = usePathBase();

    function updateHelpText(id, data) {
        const path = `${pathBase}/help_texts/${id}.json`;
        const options = {
            method: 'PUT',
            headers: fetchHeaders,
            body: JSON.stringify({ help_text: data })
        };

        return fetch(path, options).then(res => res.json());
    }

    return {
        updateHelpText,
    };
}
