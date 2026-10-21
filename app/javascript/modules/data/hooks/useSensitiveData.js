import { useEffect } from 'react';

import { fetchData } from 'modules/data';
import { usePathBase } from 'modules/routes';
import { pluralize, underscore } from 'modules/strings';
import { useDispatch } from 'react-redux';

/**
 * Loads missing resource fields through the current route, retaining Redux ownership.
 * @param {Object} data - Record whose fields may need separate requests.
 * @param {string[]} sensitiveAttributes - Fields loaded through nested resource endpoints.
 */
export function useSensitiveData(data, sensitiveAttributes) {
    const dispatch = useDispatch();
    const pathBase = usePathBase();

    const { id, type } = data;
    // Compare field names by content so new record or array references do not repeat requests.
    // The effect parses this string back into the field names to fetch.
    const missingAttributes = JSON.stringify(
        sensitiveAttributes.filter((attribute) => !data[attribute])
    );
    useEffect(() => {
        JSON.parse(missingAttributes).forEach((attribute) => {
            dispatch(
                fetchData(
                    { pathBase },
                    pluralize(underscore(type)),
                    id,
                    attribute
                )
            );
        });
    }, [dispatch, pathBase, id, type, missingAttributes]);
}

export default useSensitiveData;
