import { mutate } from 'swr';

import { invalidateAuthDependentCache } from './invalidateAuthDependentCache';

jest.mock('swr', () => ({ mutate: jest.fn() }));

test('clears authentication-dependent responses while preserving unrelated caches', () => {
    const completion = Promise.resolve();
    mutate.mockReturnValue(completion);
    expect(invalidateAuthDependentCache()).toBe(completion);
    const [matches, data] = mutate.mock.calls[0];
    expect(data).toBeUndefined();
    [
        '/history/en/searches/facets?logged-in=true',
        '$inf$/history/en/searches/archive?logged-in=true',
        '/history/en/projects/12.json',
        '/history/en/projects/12/collections?all=true',
        '/history/en/collections/42.json?lite=1',
    ].forEach((key) => expect(matches(key)).toBe(true));
    ['/history/en/languages?all=true', null, ['collection', 42]].forEach(
        (key) => expect(matches(key)).toBe(false)
    );
});
