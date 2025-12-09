import { usePathBase } from 'modules/routes';
import { useSWRConfig } from 'swr';

export default function useMutateHelpTexts() {
    const pathBase = usePathBase();
    const { mutate } = useSWRConfig();

    return function mutateHelpTexts() {
        const path = `${pathBase}/help_texts.json`;
        mutate(path);
    };
}
