import { buildProjectInstitutions } from './buildProjectInstitutions';

test('sorts and deduplicates institutions and parents even when translated names are null', () => {
    expect(
        buildProjectInstitutions([
            {
                institutions: [
                    { id: 1, name: 'Institute', parent: { id: 2, name: null } },
                ],
            },
            {
                institutions: [
                    { id: 1, name: 'Institute', parent: { id: 2, name: null } },
                ],
            },
        ])
    ).toEqual([
        { id: 2, name: null },
        { id: 1, name: 'Institute' },
    ]);
});
