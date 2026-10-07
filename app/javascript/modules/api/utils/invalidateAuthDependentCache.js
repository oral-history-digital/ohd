import { mutate } from 'swr';

export function invalidateAuthDependentCache() {
    return mutate(
        (key) =>
            typeof key === 'string' &&
            /\/(?:searches\/(?:facets|archive)\?|projects\/|collections(?:\/|\?))/.test(
                key
            ),
        undefined
    );
}
