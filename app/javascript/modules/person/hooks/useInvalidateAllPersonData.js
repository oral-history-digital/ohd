import { usePathBase } from 'modules/routes';
import { useSWRConfig } from 'swr';

export default function useInvalidateAllPersonData() {
    const pathBase = usePathBase();
    const { mutate } = useSWRConfig();

    return async function invalidateAllPersonData() {
        // Don't clear the data (undefined), just revalidate
        // This prevents components from seeing undefined data during refetch
        await mutate(
            (key) =>
                typeof key === 'string' && key.startsWith(`${pathBase}/people`)
        );
    };
}
