import numReferencesString from './numReferencesString';

test('numReferencesString returns metadata references if there are no segment references', () => {
    const actual = numReferencesString(5, 0);
    const expected = '5';
    expect(actual).toEqual(expected);
});

test('numReferencesString returns segment references if there are no metadata references', () => {
    const actual = numReferencesString(0, 50);
    const expected = '50';
    expect(actual).toEqual(expected);
});

test('numReferencesString returns both references if there are both references', () => {
    const actual = numReferencesString(5, 50);
    const expected = '5 + 50';
    expect(actual).toEqual(expected);
});
