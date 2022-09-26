import fullName from './fullName';

const person = {
    names: {
        de: {
            first_name: 'Alice',
            last_name: 'Henderson',
            birth_name: 'geb. Peterson'
        }
    }
};

test('returns full name without birthname', () => {
    const actual = fullName(person, 'de');
    const expected = 'Alice Henderson';
    expect(actual).toEqual(expected);
});

test('returns full name with birthname', () => {
    const actual = fullName(person, 'de', true);
    const expected = 'Alice Henderson geb. Peterson';
    expect(actual).toEqual(expected);
});

test('returns empty string if person is not provided', () => {
    const actual = fullName(null, 'de');
    const expected = '';
    expect(actual).toEqual(expected);
});
