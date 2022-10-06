import { useSWRConfig } from 'swr';
import { useSelector } from 'react-redux';

import { getCurrentProject } from 'modules/data';
import { usePathBase } from 'modules/routes';

export default function useMutatePeople() {
    const project = useSelector(getCurrentProject);
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
