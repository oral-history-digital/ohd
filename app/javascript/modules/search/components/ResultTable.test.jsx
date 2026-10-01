import { render, screen } from '@testing-library/react';

import ResultTable from './ResultTable';

jest.mock('modules/auth', () => ({
    useAuthorization: () => ({ isAuthorized: () => false }),
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({
        locale: 'de',
        t: (key) =>
            ({
                'metadata_labels.collection_id': 'Sammlung',
                'metadata_labels.level_of_indexing_ohd': 'Erschließungsgrad',
                'metadata_labels.subjects_ohd': 'Themen',
                'metadata_labels.countries_ohd': 'Länder',
            })[key] || key.split('.').pop(),
    }),
}));
jest.mock('modules/interview-preview', () => ({
    InterviewListRowContainer: () => null,
}));
jest.mock('modules/query-string', () => ({
    useSearchParams: () => ({}),
}));
jest.mock('modules/routes', () => ({
    useProject: () => ({
        project: {
            is_umbrella: false,
            list_columns: [
                { id: 1, name: 'collection_id', source: 'Interview' },
                { id: 2, name: 'interview_date', source: 'Interview' },
                { id: 3, name: 'level_of_indexing_ohd', source: 'Interview' },
                {
                    id: 4,
                    name: 'subjects_ohd',
                    source: 'RegistryReferenceType',
                },
                {
                    id: 5,
                    name: 'countries_ohd',
                    source: 'RegistryReferenceType',
                },
            ],
            metadata_fields: {
                2: { label: { de: 'Eigener Titel' } },
            },
        },
    }),
}));

test('uses metadata labels when no custom list label exists', () => {
    render(<ResultTable interviews={[]} />);

    expect(
        screen.getByRole('columnheader', { name: 'Sammlung' })
    ).toBeInTheDocument();
    expect(
        screen.getByRole('columnheader', { name: 'Eigener Titel' })
    ).toBeInTheDocument();
    expect(
        screen.getByRole('columnheader', { name: 'Erschließungsgrad' })
    ).toBeInTheDocument();
    expect(
        screen.getByRole('columnheader', { name: 'Themen' })
    ).toBeInTheDocument();
    expect(
        screen.getByRole('columnheader', { name: 'Länder' })
    ).toBeInTheDocument();
});
