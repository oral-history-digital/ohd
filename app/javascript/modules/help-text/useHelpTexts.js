import useSWRImmutable from 'swr/immutable';

import { usePathBase } from 'modules/routes';

export default function useHelpTexts() {
    const pathBase = usePathBase();

    const path = `${pathBase}/help_texts.json`;
    const { isLoading, isValidating, data, error } = useSWRImmutable(path);

    return { isLoading, isValidating, data, error };
}
