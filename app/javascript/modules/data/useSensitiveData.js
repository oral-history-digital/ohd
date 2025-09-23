import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { pluralize, underscore } from 'modules/strings';
import { fetchData } from 'modules/data';
import { useProject } from 'modules/routes';
import { useI18n } from 'modules/i18n';

export default function useSensitiveData(
    data,
    sensitiveAttributes,
) {
    const dispatch = useDispatch();
    const { t, locale } = useI18n();
    const { projectId, project } = useProject();

    useEffect(() => {
        sensitiveAttributes.forEach(attr => {
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
