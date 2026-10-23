import { render, screen } from '@testing-library/react';
import { useProject } from 'modules/routes';

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
jest.mock('modules/data', () =>
    jest.requireActual('../../data/utils/getResultMetadataFields')
);
jest.mock('modules/routes', () => ({ useProject: jest.fn() }));
jest.mock('modules/spinners', () => ({ Spinner: () => <p>Loading</p> }));
jest.mock('modules/ui', () => ({
    // eslint-disable-next-line react/prop-types
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));

beforeEach(() => {
    useProject.mockReturnValue({
        project: {
            is_umbrella: false,
            metadata_fields: [
                { id: 1, name: 'collection_id' },
                { id: 2, name: 'interview_date', label: 'Eigener Titel' },
                { id: 3, name: 'level_of_indexing_ohd' },
                { id: 4, name: 'subjects_ohd' },
                { id: 5, name: 'countries_ohd' },
            ].map((field) => ({ ...field, use_in_results_list: true })),
        },
    });
});

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

test('waits for metadata and shows failed requests instead of a table', () => {
    useProject.mockReturnValue({ isLoading: true });
    const { rerender } = render(<ResultTable interviews={[]} />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(useProject).toHaveBeenCalledWith({ include: ['metadata_fields'] });

    useProject.mockReturnValue({ error: { message: 'Access denied' } });
    rerender(<ResultTable interviews={[]} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Access denied');
    expect(screen.queryByText('Loading')).not.toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
});
