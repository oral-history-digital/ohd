import { useSWRConfig } from 'swr';

import { usePathBase } from 'modules/routes';

export default function useMutateHelpTexts() {
    const pathBase = usePathBase();
    const { mutate } = useSWRConfig();

    return function mutateHelpTexts() {
        const path = `${pathBase}/help_texts.json`;
        mutate(path);
    };
}
