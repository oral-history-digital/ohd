import convertLegacyQuery from './convertLegacyQuery';

test('normalizes old style queries', () => {
    const query = {
        page: 1,
        fulltext: 'athen',
        'gender[]': [
            'female',
        ],
        'workflow_state[]': [],
        'year_of_birth[]': [],
        'typology[]': [
            '646776',
        ],
        'period[]': [],
        'tasks_user_account_ids[]': [],
        'tasks_supervisor_ids[]': null,
    };

    const actual = convertLegacyQuery(query);
    const expected = {
        fulltext: 'athen',
        gender: [
            'female',
        ],
        typology: [
            '646776',
        ],
    };
    expect(actual).toEqual(expected);
});
