/* eslint-disable react/prop-types */
import { fireEvent, render, screen } from '@testing-library/react';
import { useProject } from 'modules/routes';

import WorkbookItemForm from './WorkbookItemForm';

const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockMutate = jest.fn();
jest.mock('modules/analytics', () => ({
    useTrackEventFunction: () => jest.fn(),
}));
jest.mock('modules/api', () => ({
    useWorkbookApi: () => ({
        createWorkbookItem: mockCreate,
        updateWorkbookItem: mockUpdate,
    }),
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'en', t: (key) => key }),
}));
jest.mock('modules/routes', () => ({
    useProject: jest.fn(),
    usePathBase: () => '/current/en',
}));
jest.mock('modules/spinners', () => ({ Spinner: () => <p>Loading</p> }));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
    CopyText: () => null,
}));
jest.mock('../useMutateWorkbook', () => ({
    __esModule: true,
    default: () => mockMutate,
}));

const currentProject = { id: 7, name: 'Current project' };
const suppliedProject = { id: 8, name: 'Saved project' };
const props = {
    interview: {
        archive_id: 'p001',
        anonymous_title: { en: 'Interview title' },
        interview_date: '2000-01-01',
    },
    type: 'InterviewReference',
    properties: {},
    description: '',
    onSubmit: jest.fn(),
};

beforeEach(() => {
    jest.clearAllMocks();
    useProject.mockReturnValue({ project: currentProject });
    mockCreate.mockResolvedValue({ id: 5, data: { id: 5 } });
    mockUpdate.mockResolvedValue({ data: { id: 5 } });
});

test('form waits for current project details, retains edits while loading, and hides on access failure', () => {
    useProject.mockReturnValue({ isLoading: true });
    const { rerender } = render(<WorkbookItemForm {...props} />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(
        screen.queryByRole('textbox', { name: 'title' })
    ).not.toBeInTheDocument();
    useProject.mockReturnValue({ project: currentProject });
    rerender(<WorkbookItemForm {...props} />);
    expect(useProject).toHaveBeenCalledWith();
    expect(screen.getByText(/Current project,/)).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox', { name: 'title' }), {
        target: { value: 'My note' },
    });
    useProject.mockReturnValue({ isLoading: true });
    rerender(<WorkbookItemForm {...props} />);
    useProject.mockReturnValue({ project: currentProject });
    rerender(<WorkbookItemForm {...props} />);
    expect(screen.getByRole('textbox', { name: 'title' })).toHaveValue(
        'My note'
    );
    useProject.mockReturnValue({
        project: currentProject,
        error: { message: 'Access denied' },
    });
    rerender(<WorkbookItemForm {...props} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Access denied');
    expect(
        screen.queryByRole('button', { name: 'save' })
    ).not.toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
});

test('supplied project provides the citation even when current project loading fails', () => {
    useProject.mockReturnValue({
        error: { message: 'Current project unavailable' },
    });
    render(<WorkbookItemForm {...props} project={suppliedProject} />);
    expect(screen.getByText(/Saved project,/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'save' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

test.each([undefined, suppliedProject])(
    'creating an entry preserves project assignment and workbook cache updates (project: %j)',
    async (project) => {
        render(<WorkbookItemForm {...props} project={project} />);
        fireEvent.click(screen.getByRole('button', { name: 'save' }));
        const updated = await mockMutate.mock.calls[0][0]({
            data: { 4: { id: 4 } },
        });
        const saved = mockCreate.mock.calls[0][0];
        expect(saved.title).toContain('Interview title');
        expect(saved.project_id).toBe(project?.id);
        expect(updated.data).toEqual({ 4: { id: 4 }, 5: { id: 5 } });
        expect(props.onSubmit).toHaveBeenCalledTimes(1);
    }
);

test('editing an entry uses its saved ID and keeps segment citation and link', async () => {
    render(
        <WorkbookItemForm
            {...props}
            id={5}
            title="Saved segment"
            type="UserAnnotation"
            properties={{ interview_archive_id: 'p001', tape_nbr: 2, time: 62 }}
        />
    );
    expect(screen.getByText(/tape: 2/)).toBeInTheDocument();
    expect(
        screen.getByText(/\/current\/en\/interviews\/p001\?tape=2/)
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'save' }));
    await mockMutate.mock.calls[0][0]({ data: {} });
    expect(mockUpdate).toHaveBeenCalledWith(
        5,
        expect.objectContaining({ title: 'Saved segment' })
    );
    expect(mockCreate).not.toHaveBeenCalled();
});
