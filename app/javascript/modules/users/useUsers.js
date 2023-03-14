import useSWRImmutable from 'swr/immutable';

import { usePathBase } from 'modules/routes';

export default function useUsers(page) {
    const pathBase = usePathBase();

    const path = `${pathBase}/user_registrations.json?page=${page}`;
    const { isLoading, isValidating, data, error } = useSWRImmutable(path);

    return { isLoading, isValidating, data: data, error };
}
