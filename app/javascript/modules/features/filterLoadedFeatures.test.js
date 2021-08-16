import filterLoadedFeatures from './filterLoadedFeatures';

test('returns empty object if loaded features is null', () => {
    const actual = filterLoadedFeatures(null, []);
    const expected = {};
    expect(actual).toEqual(expected);
});

test('returns only loaded features that are available', () => {
    const loadedFeatures = {
        'dummy-feature': true,
        'old-and-no-longer-used-feature': true,
    };
    const actual = filterLoadedFeatures(loadedFeatures, ['dummy-feature']);
    const expected = {
        'dummy-feature': true,
    };
    expect(actual).toEqual(expected);
});

test('adds new features that are not part of the loaded state', () => {
    const actual = filterLoadedFeatures({}, ['new-feature']);
    const expected = {
        'new-feature': false,
    };
    expect(actual).toEqual(expected);
});
