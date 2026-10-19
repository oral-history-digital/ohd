/* eslint-disable react/prop-types */
import { fireEvent, render, screen } from '@testing-library/react';

import { useCatalogProjects } from '../hooks';
import { ProjectList } from './ProjectList';

jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
jest.mock('../hooks', () => ({
    useCatalogProjects: jest.fn(),
    useAccordion: jest.requireActual('../hooks/useAccordion').useAccordion,
    useProjectsSort: () => ({ sort: 'interviews_desc', setSort: jest.fn() }),
    useProjectsAndCollectionsRange: () => ({
        globalCollectionMin: 0,
        globalCollectionMax: 10,
    }),
    useExplorerListCountLabel: ({ displayedItems }) =>
        `${displayedItems.length} projects`,
}));
jest.mock('./ProjectSortControl', () => ({ ProjectSortControl: () => null }));
jest.mock('./ProjectCard', () => ({
    ProjectCard: ({ project, expanded, onToggle }) => (
        <button onClick={onToggle} aria-expanded={expanded}>
            {project.name}
        </button>
    ),
}));

const projects = [
    {
        id: 1,
        name: 'First',
        interviews: { total: 1 },
        collections: { total: 1 },
        institutions: [
            { id: 2, name: 'Institute', parent: { id: 3, name: 'Parent' } },
        ],
        collection_preview: [{ name: 'Collection', notes: 'Needle' }],
    },
    {
        id: 2,
        name: 'Unpublished',
        workflow_state: 'unshared',
        interviews: { total: 5 },
        collections: { total: 2 },
    },
];

beforeEach(() =>
    useCatalogProjects.mockReturnValue({
        projects,
        isLoading: false,
        error: null,
    })
);

test('renders all returned projects, sorts by interview count, and expands a card', () => {
    render(<ProjectList />);
    const cards = screen.getAllByRole('button');
    expect(cards.map((card) => card.textContent)).toEqual([
        'Unpublished',
        'First',
    ]);
    fireEvent.click(cards[0]);
    expect(cards[0]).toHaveAttribute('aria-expanded', 'true');
});

test('filters by collection preview text and parent institution without losing range filters', () => {
    render(
        <ProjectList
            query="Needle"
            institutionIds={[3]}
            interviewMin={0}
            interviewMax={2}
            collectionMin={0}
            collectionMax={1}
        />
    );
    expect(screen.getByRole('button', { name: 'First' })).toBeInTheDocument();
    expect(
        screen.queryByRole('button', { name: 'Unpublished' })
    ).not.toBeInTheDocument();
    expect(screen.getByText('1 projects')).toBeInTheDocument();
});

test('preserves loading error and empty states', () => {
    useCatalogProjects.mockReturnValue({ projects: [], isLoading: true });
    const { rerender } = render(<ProjectList />);
    expect(
        screen.getByText('explorer.project_list.loading')
    ).toBeInTheDocument();
    useCatalogProjects.mockReturnValue({
        projects: [],
        error: { message: 'Offline' },
    });
    rerender(<ProjectList />);
    expect(screen.getByText('explorer.project_list.error')).toBeInTheDocument();
    useCatalogProjects.mockReturnValue({ projects: [], error: null });
    rerender(<ProjectList />);
    expect(
        screen.getByText('explorer.project_list.no_results')
    ).toBeInTheDocument();
});
