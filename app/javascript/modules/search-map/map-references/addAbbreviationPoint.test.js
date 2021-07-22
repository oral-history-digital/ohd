import addAbbreviationPoint from './addAbbreviationPoint';

test('adds point to last name if last name is only one letter', () => {
    const references = [
        {
            id: 1,
            last_name: 'D',
        },
    ];

    const actual = addAbbreviationPoint(references);
    const expected = [
        {
            id: 1,
            last_name: 'D.',
        },
    ];

    expect(actual).toEqual(expected);
});

test('does not change last name otherwise', () => {
    const references = [
        {
            id: 1,
            last_name: 'Duck',
        },
    ];

    const actual = addAbbreviationPoint(references);
    const expected = [
        {
            id: 1,
            last_name: 'Duck',
        },
    ];

    expect(actual).toEqual(expected);
});
