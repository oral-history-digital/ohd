import useSWRImmutable from 'swr/immutable';
import { useSelector } from 'react-redux';
import keyBy from 'lodash.keyby';

import { useI18n } from 'modules/i18n';
import { fetcher } from 'modules/api';
import { getCurrentProject } from 'modules/data';
import { usePathBase } from 'modules/routes';

export default function useWorkbook() {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const project = useSelector(getCurrentProject);

    const path = `${pathBase}/user_contents`;
    const { isValidating, data, error } = useSWRImmutable(path, fetcher);

    let itemsByInterview;
    if (data) {
        itemsByInterview = Object
            .values(data.data)
            .filter((ref) => ref.type === 'InterviewReference');
        itemsByInterview = keyBy(itemsByInterview, 'media_id');
    }

    console.log(itemsByInterview);

    return { isValidating, itemsByInterview, error };
}
