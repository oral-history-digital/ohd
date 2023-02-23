import useSWRImmutable from 'swr/immutable';

import { usePathBase } from 'modules/routes';

export default function useHelpTexts() {
    const pathBase = usePathBase();

    const path = `${pathBase}/user_registrations.json`;
    const { isLoading, isValidating, data, error } = useSWRImmutable(path);

    return { isLoading, isValidating, data: data?.data, error };
}
