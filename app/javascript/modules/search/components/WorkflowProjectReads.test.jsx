/* eslint-disable react/prop-types */
import { fireEvent, render, screen } from '@testing-library/react';
import { Fetch } from 'modules/data';
import { MemoryRouter } from 'react-router-dom';

import InterviewWorkflowRow from '../../workflow/InterviewWorkflowRow';
import TaskContainer from '../../workflow/TaskContainer';
import ArchiveSearchTabs from './ArchiveSearchTabs';

const mockHide = jest.fn();
const mockShow = jest.fn();
jest.mock('modules/routes', () => ({
    usePathBase: () => '/adg/en',
    useProjectIdentity: () => ({ projectDbId: 7, projectShortname: 'adg' }),
}));
jest.mock('modules/data', () => ({
    Fetch: jest.fn(({ children }) => children),
    getTaskTypesForCurrentProjectFetched: jest.fn(),
}));
jest.mock('modules/auth', () => ({
    useAuthorization: () => ({ isAuthorized: () => true }),
    AuthorizedContent: ({ children }) => children,
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'en', t: (key) => key }),
}));
jest.mock('modules/sidebar', () => ({
    useSidebar: () => ({ hide: mockHide, show: mockShow }),
}));
jest.mock('modules/search', () => ({
    useArchiveSearch: () => ({ fulltext: 'history' }),
}));
jest.mock('modules/person', () => ({
    usePeople: () => ({ isLoading: false }),
}));
jest.mock('modules/help-text', () => ({ HelpText: () => null }));
jest.mock('modules/forms', () => ({ SingleValueWithForm: () => null }));
jest.mock('modules/workflow', () => ({
    InterviewWorkflowRowContainer: () => null,
}));
jest.mock('swr/immutable', () => () => ({ data: { data: [] } }));
jest.mock(
    './ResultGrid',
    () =>
        function Grid() {
            return <p>Grid results</p>;
        }
);
jest.mock(
    './ResultTable',
    () =>
        function Table() {
            return <p>Table results</p>;
        }
);
jest.mock('../../workflow/TaskContainer', () => ({
    __esModule: true,
    default: jest.fn(() => <p>Task editor</p>),
}));

beforeEach(() => jest.clearAllMocks());

test('search views load collections and scoped task types without a legacy project request', () => {
    render(
        <ArchiveSearchTabs
            interviews={[]}
            empty={false}
            loading={false}
            currentViewMode="workflow"
            viewModes={['grid', 'list', 'workflow']}
            setViewMode={jest.fn()}
        />
    );
    expect(Fetch.mock.calls.map(([props]) => props.fetchParams)).toEqual([
        ['collections', null, null, 'all'],
        ['task_types', null, null, 'for_projects=7'],
    ]);
});

test('search view changes retain sidebar behavior', () => {
    const setViewMode = jest.fn();
    render(
        <ArchiveSearchTabs
            interviews={[]}
            empty={false}
            loading={false}
            currentViewMode="grid"
            viewModes={['grid', 'list', 'workflow']}
            setViewMode={setViewMode}
        />
    );
    expect(screen.getByText('Grid results')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'list' }));
    expect(setViewMode).toHaveBeenCalledWith('list');
    expect(mockShow).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('tab', { name: 'workflow' }));
    expect(mockHide).toHaveBeenCalled();
});

test('workflow rows use separate resources and react to task-type configuration changes', () => {
    const fetchData = jest.fn();
    const props = {
        interview: {
            id: 1,
            archive_id: 'adg001',
            task_ids: [3],
            language_id: 1,
            collection_id: 2,
            duration: 10,
        },
        languages: { 1: { name: { en: 'English' } } },
        collections: { 2: { name: { en: 'Collection name' } } },
        taskTypes: { 4: { use: true } },
        tasks: {
            3: {
                id: 3,
                task_type: {
                    id: 4,
                    label: { en: 'Transcript' },
                    abbreviation: 'T',
                },
            },
        },
        tasksStatus: { for_interview_adg001: 'fetched' },
        fetchData,
        setArchiveId: jest.fn(),
    };
    const { rerender } = render(
        <MemoryRouter>
            <InterviewWorkflowRow {...props} />
        </MemoryRouter>
    );
    expect(screen.getByText('Collection name')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute(
        'href',
        '/adg/en/interviews/adg001?fulltext=history'
    );
    fireEvent.click(screen.getByRole('button', { name: 'edit_workflow' }));
    expect(screen.getByText('Task editor')).toBeInTheDocument();
    expect(TaskContainer.mock.lastCall[0].task.id).toBe(3);
    rerender(
        <MemoryRouter>
            <InterviewWorkflowRow
                {...props}
                taskTypes={{ 4: { use: false } }}
            />
        </MemoryRouter>
    );
    expect(screen.queryByText('Task editor')).not.toBeInTheDocument();
    rerender(
        <MemoryRouter>
            <InterviewWorkflowRow {...props} tasksStatus={{}} />
        </MemoryRouter>
    );
    expect(fetchData).toHaveBeenCalledWith(
        { pathBase: '/adg/en' },
        'tasks',
        null,
        null,
        'for_interview=adg001'
    );
});
