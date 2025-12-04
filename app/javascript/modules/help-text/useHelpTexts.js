import { usePathBase } from 'modules/routes';
import useSWRImmutable from 'swr/immutable';

export default function useHelpTexts() {
    const pathBase = usePathBase();

    const path = `${pathBase}/help_texts.json`;
    const { isLoading, isValidating, data, error } = useSWRImmutable(path);

    return { isLoading, isValidating, data, error };
}
