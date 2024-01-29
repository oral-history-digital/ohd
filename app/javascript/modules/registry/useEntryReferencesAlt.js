import useSWRImmutable from 'swr/immutable';
import { useSelector } from 'react-redux';

import { useI18n } from 'modules/i18n';
import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import { useProject } from 'modules/routes';
import { getIsLoggedIn } from 'modules/user';

export default function useEntryReferencesAlt(registryEntry) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const { project } = useProject();
    const isLoggedIn = useSelector(getIsLoggedIn);

    const path = `${pathBase}/registry_references/for_reg_entry/${registryEntry.id}?signed_in=${isLoggedIn}`;
    const { isValidating, data, error } = useSWRImmutable(path, fetcher);

    return { isValidating, data, error };
}
