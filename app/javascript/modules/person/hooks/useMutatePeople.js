import { useSWRConfig } from 'swr';

import { usePathBase, useProject } from 'modules/routes';

export default function useMutatePeople() {
    const { project } = useProject();
    const pathBase = usePathBase();
    const { mutate } = useSWRConfig();

    return function mutatePeople(updateDocument) {
        const path = `${pathBase}/people.json?for_projects=${project.id}`;

        if (typeof updateDocument === 'function') {
            mutate(path, updateDocument, { revalidate: false });
        } else {
            mutate(path);
        }
    }
}
