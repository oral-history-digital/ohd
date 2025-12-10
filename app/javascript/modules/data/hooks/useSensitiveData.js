import { useEffect } from 'react';

import { fetchData } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { pluralize, underscore } from 'modules/strings';
import { useDispatch } from 'react-redux';

export function useSensitiveData(data, sensitiveAttributes) {
    const dispatch = useDispatch();
    const { locale } = useI18n();
    const { projectId, project } = useProject();

    useEffect(() => {
        sensitiveAttributes.forEach((attr) => {
            if (!data[attr]) {
                dispatch(
                    fetchData(
                        { projectId, locale, project },
                        pluralize(underscore(data.type)),
                        data.id,
                        attr
                    )
                );
            }
        });
    }, sensitiveAttributes);
}

export default useSensitiveData;
