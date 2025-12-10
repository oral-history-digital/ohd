import { usePathBase } from 'modules/routes';

import fetchHeaders from './fetchHeaders';

export default function useEventTypeApi() {
    const pathBase = usePathBase();

    function createEventType(data) {
        const path = `${pathBase}/event_types.json`;
        const options = {
            method: 'POST',
            headers: fetchHeaders,
            body: JSON.stringify({ event_type: data }),
        };

        return fetch(path, options).then((res) => res.json());
    }

    function updateEventType(id, data) {
        const path = `${pathBase}/event_types/${id}.json`;
        const options = {
            method: 'PUT',
            headers: fetchHeaders,
            body: JSON.stringify({ event_type: data }),
        };

        return fetch(path, options).then((res) => res.json());
    }

    function deleteEventType(id) {
        const path = `${pathBase}/event_types/${id}.json`;
        const options = {
            method: 'DELETE',
            headers: fetchHeaders,
        };

        return fetch(path, options).then((res) => res.json());
    }

    return {
        createEventType,
        updateEventType,
        deleteEventType,
    };
}
