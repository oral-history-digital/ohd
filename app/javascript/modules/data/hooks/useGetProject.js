import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import useSWRImmutable from 'swr/immutable';

function normalizeIdentifier(value) {
    if (value === null || value === undefined) {
        return null;
    }

    return String(value);
}

function resolveProjectIdentifier({ id, shortname }) {
    const normalizedId = normalizeIdentifier(id);
    const normalizedShortname = normalizeIdentifier(shortname);
    const hasId = Boolean(normalizedId);
    const hasShortname = Boolean(normalizedShortname);

    if (hasId && hasShortname) {
        return {
            identifier: null,
            error: new Error(
                'useGetProject expects exactly one identifier: provide either id or shortname, not both'
            ),
        };
    }

    return {
        identifier: hasId ? normalizedId : normalizedShortname,
        error: null,
    };
}

function buildProjectPath(pathBase, identifier, lite) {
    if (!identifier) {
        return null;
    }

    const queryParams = new URLSearchParams();
    if (lite) {
        queryParams.set('lite', '1');
    }

    const queryString = queryParams.toString();
    return `${pathBase}/projects/${identifier}.json${
        queryString ? `?${queryString}` : ''
    }`;
}

/**
 * Fetches one project by numeric id or shortname.
 *
 * Input contract:
 * - pass either `id` or `shortname`
 * - do not pass both at the same time
 * - `lite: true` requests the lightweight project payload
 */
export function useGetProject({
    id = null,
    shortname = null,
    lite = false,
} = {}) {
    const pathBase = usePathBase();
    const { identifier, error: conflictError } = resolveProjectIdentifier({
        id,
        shortname,
    });
    const path = conflictError
        ? null // If there's a conflict in identifiers, we won't make an API call and instead return the error.
        : buildProjectPath(pathBase, identifier, lite);

    const { data, error, isLoading, isValidating, mutate } = useSWRImmutable(
        path,
        fetcher
    );

    return {
        project: data?.data,
        loading: Boolean(path) && !conflictError && (isLoading || isValidating),
        error: conflictError || error,
        mutate,
    };
}

export default useGetProject;
