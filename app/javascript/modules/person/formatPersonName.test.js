import formatPersonName from './formatPersonName';

const person = {
    names: {
        de: {
            first_name: 'Alice',
            last_name: 'Henderson',
            birth_name: 'geb. Peterson'
        }
    },
    title: 'doctor',
    gender: 'female'
};

const translations = {
    de: {
        modules: {
            person: {
                abbr_titles: {
                    doctor_female: 'Dr.'
                }
            }
        }
    }
};

test('returns full name without birthname', () => {
    const actual = formatPersonName(person, translations);
    const expected = 'Alice Henderson';
    expect(actual).toEqual(expected);
});

test('returns full name with birthname', () => {
    const actual = formatPersonName(person, translations, { withBirthName: true });
    const expected = 'Alice Henderson geb. Peterson';
    expect(actual).toEqual(expected);
});

test('returns full name with title', () => {
    const actual = formatPersonName(person, translations, { withTitle: true });
    const expected = 'Dr. Alice Henderson';
    expect(actual).toEqual(expected);
});

test('returns empty string if person is not provided', () => {
    const actual = formatPersonName(null, translations);
    const expected = '';
    expect(actual).toEqual(expected);
});
