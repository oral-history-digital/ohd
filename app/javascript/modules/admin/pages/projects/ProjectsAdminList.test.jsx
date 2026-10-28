/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { useProjectList } from 'modules/data';

import { PaginatedAdminRecordList } from '../../components';
import ProjectsAdminPage from './ProjectsAdminPage';

jest.mock('modules/data', () => ({
    useProjectList: jest.fn(),
    ProjectTile: () => null,
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key }),
}));
jest.mock('modules/spinners', () => ({
    Spinner: () => <div>Loading projects</div>,
}));
jest.mock('../../hooks', () => ({
    useAdminDataActions: () => ({}),
}));
jest.mock('../../components', () => ({
    PaginatedAdminRecordList: jest.fn(({ data }) => (
        <div>
            {data.map((project) => (
                <p key={project.id}>{project.name}</p>
            ))}
        </div>
    )),
}));

beforeEach(() => {
    jest.clearAllMocks();
    useProjectList.mockReturnValue({
        projects: [
            { id: 7, name: 'Unpublished project', workflow_state: 'unshared' },
        ],
    });
});

test('renders the requested list with institutions and adds the type required by admin permissions', () => {
    render(<ProjectsAdminPage />);
    expect(useProjectList).toHaveBeenCalledWith({
        all: true,
        include: ['institutions'],
    });
    expect(screen.getByText('Unpublished project')).toBeInTheDocument();
    expect(PaginatedAdminRecordList.mock.lastCall[0]).toMatchObject({
        data: [{ id: 7, name: 'Unpublished project', type: 'Project' }],
        query: null,
        sensitiveAttributes: [],
        hideRegisterDoiAction: false,
    });
    expect(
        PaginatedAdminRecordList.mock.lastCall[0].otherDataToLoad
    ).toBeUndefined();
    expect(
        useProjectList.mock.results[0].value.projects[0].type
    ).toBeUndefined();
});

test('shows initial loading and errors, and keeps the list mounted during refresh', () => {
    useProjectList.mockReturnValue({ projects: [], isLoading: true });
    const { rerender } = render(<ProjectsAdminPage />);
    expect(screen.getByText('Loading projects')).toBeInTheDocument();
    expect(PaginatedAdminRecordList).not.toHaveBeenCalled();

    useProjectList.mockReturnValue({
        projects: [],
        error: { message: 'Forbidden' },
    });
    rerender(<ProjectsAdminPage />);
    expect(screen.getByRole('alert')).toHaveTextContent('Forbidden');

    useProjectList.mockReturnValue({ projects: [{ id: 7, name: 'Project' }] });
    rerender(<ProjectsAdminPage />);
    const list = screen.getByText('Project');
    useProjectList.mockReturnValue({
        projects: [{ id: 7, name: 'Project' }],
        isValidating: true,
    });
    rerender(<ProjectsAdminPage />);
    expect(screen.getByText('Project')).toBe(list);

    useProjectList.mockReturnValue({
        projects: [{ id: 7, name: 'Updated project' }],
    });
    rerender(<ProjectsAdminPage />);
    expect(screen.getByText('Updated project')).toBeInTheDocument();
});
