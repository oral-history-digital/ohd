/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { useAuthorization } from 'modules/auth';
import { useProject } from 'modules/routes';

import ThumbnailMetadata from './ThumbnailMetadata';

jest.mock('modules/data', () => ({
    ...jest.requireActual('../data/utils/getResultMetadataFields'),
    getCurrentUser: () => null,
    useHumanReadable: () => ({
        humanReadable: ({ obj, attribute }) => obj[attribute],
    }),
}));
jest.mock('react-redux', () => ({ useSelector: (selector) => selector() }));
jest.mock('modules/auth', () => ({ useAuthorization: jest.fn() }));
jest.mock('modules/routes', () => ({ useProject: jest.fn() }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'en', t: (key) => key }),
}));
jest.mock('modules/person', () => ({
    usePersonWithAssociations: () => ({ data: {}, isLoading: false }),
}));
jest.mock('modules/events', () => ({ formatEventShort: jest.fn() }));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));

const interview = {
    id: 9,
    workflow_state: 'restricted',
    description: 'Protected description',
    collection_id: 'Public collection',
};

beforeEach(() => {
    useAuthorization.mockReturnValue({ isAuthorized: () => false });
    useProject.mockReturnValue({
        project: {
            metadata_fields: [
                {
                    id: 1,
                    name: 'description',
                    source: 'Interview',
                    use_in_results_table: true,
                },
                {
                    id: 2,
                    name: 'collection_id',
                    source: 'Interview',
                    use_in_results_table: true,
                    display_on_landing_page: true,
                },
            ],
        },
    });
});

test('shows landing-page fields while keeping restricted metadata hidden until authorized', () => {
    const { rerender } = render(<ThumbnailMetadata interview={interview} />);
    expect(useProject).toHaveBeenCalledWith({ include: ['metadata_fields'] });
    expect(screen.getByText('Public collection')).toBeInTheDocument();
    expect(screen.queryByText('Protected description')).not.toBeInTheDocument();

    useAuthorization.mockReturnValue({ isAuthorized: () => true });
    rerender(<ThumbnailMetadata interview={interview} />);
    expect(screen.getByText('Protected description')).toBeInTheDocument();
});

test('replaces loading placeholders with an error when metadata cannot be loaded', () => {
    useProject.mockReturnValue({ isLoading: true });
    const { rerender } = render(<ThumbnailMetadata interview={interview} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.queryByText('Public collection')).not.toBeInTheDocument();

    useProject.mockReturnValue({ error: { message: 'Access denied' } });
    rerender(<ThumbnailMetadata interview={interview} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Access denied');
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
});
