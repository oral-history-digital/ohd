import { usePathBase } from 'modules/routes';
import fetchHeaders from './fetchHeaders';

export default function useHelpTextApi() {
    const pathBase = usePathBase();

    function deleteHelpText(id) {
        const path = `${pathBase}/help_texts/${id}.json`;
        const options = {
            method: 'DELETE',
            headers: fetchHeaders
        };

        return fetch(path, options).then(res => res.json());
    }

    return {
        deleteHelpText,
    };
}
