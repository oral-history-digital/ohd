import convertLegacyQuery from './convertLegacyQuery';

test('normalizes old style queries', () => {
    const query = {
        page: 1,
        fulltext: 'athen',
        'gender[]': ['female'],
        'workflow_state[]': [],
        'year_of_birth[]': [
            '1922',
            1923,
            1924,
            1925,
            1926,
            1927,
            1928,
            1929,
            1930,
            1931,
            1932,
            1933,
            1934,
        ],
        'typology[]': ['646776'],
        'period[]': [],
        'tasks_user_ids[]': [],
        'tasks_supervisor_ids[]': null,
    };

    const actual = convertLegacyQuery(query);
    const expected = {
        fulltext: 'athen',
        gender: ['female'],
        year_of_birth_min: 1922,
        year_of_birth_max: 1934,
        typology: ['646776'],
    };
    expect(actual).toEqual(expected);
});
