/* eslint-disable react/prop-types */
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';

import { useCatalogProjects } from '../hooks';
import { ExplorerSidebarSearch } from './ExplorerSidebarSearch';

jest.mock('modules/data', () => ({
    useGetInstitutionsList: () => ({ institutions: [] }),
}));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
jest.mock('modules/routes', () => ({
    useCurrentPage: () => ({
        pageType: 'catalog_page',
        params: { catalogType: 'root' },
    }),
}));
jest.mock('modules/ui', () => ({
    Switch: jest.requireActual('../../ui/Switch').default,
    ResetFiltersButton: ({ onClick }) => (
        <button onClick={onClick}>Reset filters</button>
    ),
}));
jest.mock('../hooks', () => ({
    useCatalogProjects: jest.fn(),
    useExplorerProjectInstitutions: () => [],
    useExplorerInterviewRange: () => ({ globalMin: 0, globalMax: 10 }),
    useProjectsAndCollectionsRange: () => ({
        globalCollectionMin: 0,
        globalCollectionMax: 10,
    }),
}));
jest.mock('./ExplorerRangeFilter', () => ({ ExplorerRangeFilter: () => null }));
jest.mock('./ExplorerInstitutionFilter', () => ({
    ExplorerInstitutionFilter: () => null,
}));
jest.mock('./ExplorerSearchInput', () => ({ ExplorerSearchInput: () => null }));

/**
 * Shows current URL parameters to verify sidebar navigation.
 * @returns {import('react').ReactElement} Current query string.
 */
function Location() {
    return <output data-testid="location">{useLocation().search}</output>;
}

test('offers unpublished projects only when accessible and resets to unchecked', () => {
    useCatalogProjects.mockReturnValue({
        projects: [
            { workflow_state: 'public' },
            { workflow_state: 'unshared' },
        ],
    });
    const { rerender } = render(
        <MemoryRouter initialEntries={['/?unrelated=keep']}>
            <ExplorerSidebarSearch />
            <Location />
        </MemoryRouter>
    );
    const publicationSwitch = screen.getByRole('switch', {
        name: 'explorer.filter.show_unpublished_projects',
    });
    expect(publicationSwitch).not.toBeChecked();
    fireEvent.click(publicationSwitch);
    expect(publicationSwitch).toBeChecked();
    expect(screen.getByTestId('location')).toHaveTextContent(
        'explorer_show_unpublished=true'
    );
    fireEvent.click(screen.getByRole('button', { name: 'Reset filters' }));
    expect(publicationSwitch).not.toBeChecked();
    expect(screen.getByTestId('location')).toHaveTextContent('?unrelated=keep');
    useCatalogProjects.mockReturnValue({
        projects: [{ workflow_state: 'public' }],
    });
    rerender(
        <MemoryRouter>
            <ExplorerSidebarSearch />
            <Location />
        </MemoryRouter>
    );
    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
});
