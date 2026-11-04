/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { useAuthorization } from 'modules/auth';
import { getCollections } from 'modules/data';
import { useProject } from 'modules/routes';

import ThumbnailMetadata from './ThumbnailMetadata';

jest.mock('modules/data', () => ({
    ...jest.requireActual('../data/utils/getResultMetadataFields'),
    getCurrentUser: () => null,
    getCollections: jest.fn(),
    useHumanReadable: () => ({
        humanReadable: ({ obj, attribute }) =>
            attribute === 'collection_id'
                ? 'Public collection'
                : obj[attribute],
    }),
}));
jest.mock('react-redux', () => ({ useSelector: (selector) => selector() }));
jest.mock('modules/auth', () => ({ useAuthorization: jest.fn() }));
jest.mock('modules/routes', () => ({ useProject: jest.fn() }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({
        locale: 'en',
        t: (key) =>
            ({
                'activerecord.models.collection.one': 'Collection',
                'workflow_state.unshared': 'not public',
            })[key] || key,
    }),
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
    collection_id: 2,
    project_id: 7,
};

beforeEach(() => {
    getCollections.mockReturnValue({});
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

test.each([
    ['public', 7, false],
    ['unshared', 7, true],
    ['unshared', 8, false],
    [undefined, 7, false],
])(
    'grid collection status %s in project %s shows badge: %s',
    (workflow_state, project_id, visible) => {
        getCollections.mockReturnValue({ 2: { workflow_state, project_id } });
        render(<ThumbnailMetadata interview={interview} />);
        const badge = screen.queryByRole('img', {
            name: 'Collection not public',
        });
        expect(Boolean(badge)).toBe(visible);
        expect(screen.getByText('Public collection')).toBeInTheDocument();
    }
);

test('unpublished collection badge has hover and accessible text without visible text', () => {
    getCollections.mockReturnValue({
        2: { workflow_state: 'unshared', project_id: 7 },
    });
    const { rerender } = render(<ThumbnailMetadata interview={interview} />);
    const badge = screen.getByRole('img', { name: 'Collection not public' });
    expect(badge).toHaveAttribute('title', 'Collection not public');
    expect(badge.textContent).toBe('');
    useProject.mockReturnValue({
        project: {
            metadata_fields: [
                {
                    id: 2,
                    name: 'collection_id',
                    source: 'Interview',
                    use_in_results_table: true,
                    display_on_landing_page: false,
                },
            ],
        },
    });
    rerender(<ThumbnailMetadata interview={interview} />);
    expect(
        screen.queryByRole('img', { name: 'Collection not public' })
    ).toBeNull();
    expect(screen.queryByText('Public collection')).toBeNull();
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
