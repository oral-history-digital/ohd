import { render, screen } from '@testing-library/react';

import ProjectList from './ProjectList';

jest.mock('modules/data', () => ({
    useGetProjects: () => ({ projects: [], isLoading: true }),
}));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
jest.mock('../hooks', () => ({
    useAccordion: () => ({}),
    useProjectsSort: () => ({}),
    useProjectsAndCollectionsRange: () => ({}),
    useExplorerListCountLabel: () => '',
}));
jest.mock('../utils', () => ({ filterProjects: () => [] }));
jest.mock('./ProjectCard', () => ({ ProjectCard: () => null }));
jest.mock('./ProjectSortControl', () => ({ ProjectSortControl: () => null }));

it('shows the shared small spinner alongside the catalog loading label', () => {
    render(<ProjectList />);

    expect(
        screen.getByText('explorer.project_list.loading')
    ).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveClass('Spinner');
    expect(screen.getByRole('progressbar').firstElementChild).toHaveStyle({
        width: '32px',
        height: '32px',
    });
});
