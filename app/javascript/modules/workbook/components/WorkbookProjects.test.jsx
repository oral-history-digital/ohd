/* eslint-disable react/prop-types */
import { fireEvent, render, screen } from '@testing-library/react';
import { useProjectDetail } from 'modules/data';
import { useProject } from 'modules/routes';
import { isMobile } from 'modules/user-agent';

import WorkbookActions from './WorkbookActions';
import WorkbookItemList from './WorkbookItemList';

let mockInterviews;
const mockActions = {
    fetchData: jest.fn(),
    setArchiveId: jest.fn(),
    sendTimeChangeRequest: jest.fn(),
    hideSidebar: jest.fn(),
};
jest.mock('modules/data', () => ({ useProjectDetail: jest.fn() }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'en', t: (key) => key }),
}));
jest.mock('modules/routes', () => ({
    useProject: jest.fn(),
    LinkOrA: ({ project, to, onLinkClick, children }) => (
        <a href={`/${project.shortname}/en/${to}`} onClick={onLinkClick}>
            {children}
        </a>
    ),
}));
jest.mock('modules/search', () => ({
    useFacets: () => ({ facets: {} }),
    convertLegacyQuery: (query) => query,
}));
jest.mock('modules/interview-helpers', () => ({ TapeAndTime: () => null }));
jest.mock('modules/user-agent', () => ({ isMobile: jest.fn() }));
jest.mock('modules/spinners', () => ({ Spinner: () => <p>Loading</p> }));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));
jest.mock('./WorkbookActions', () => jest.fn(() => null));
jest.mock(
    './WorkbookItemContainer',
    () =>
        function MockWorkbookItemContainer(props) {
            const WorkbookItem = jest.requireActual('./WorkbookItem').default;
            return (
                <WorkbookItem
                    {...props}
                    {...mockActions}
                    statuses={{ interviews: {} }}
                    interviews={mockInterviews}
                />
            );
        }
);

const contents = [
    {
        id: 1,
        type: 'InterviewReference',
        project_id: 7,
        media_id: 'p001',
        title: 'Saved interview',
        properties: {},
    },
    {
        id: 2,
        type: 'Search',
        project_id: 8,
        title: 'Saved search',
        properties: { fulltext: 'history' },
    },
    {
        id: 3,
        type: 'UserAnnotation',
        project_id: 7,
        media_id: 'p001',
        title: 'Saved segment',
        properties: { interview_archive_id: 'p001', tape_nbr: 2, time: 62 },
    },
].map((item) => ({ ...item, created_at: '2026-01-02' }));

beforeEach(() => {
    jest.clearAllMocks();
    useProject.mockReturnValue({ project: { id: 7, is_umbrella: true } });
    mockInterviews = { p001: { transcript_coupled: true } };
    isMobile.mockReturnValue(false);
    useProjectDetail.mockImplementation((id) => ({
        project: { id, shortname: `project${id}` },
    }));
});

test('umbrella lists preserve entry order and project-specific interview, search, and segment links', () => {
    const { container } = render(
        <WorkbookItemList type="saved_interviews" contents={contents} />
    );
    expect(
        screen.getAllByRole('heading').map((heading) => heading.textContent)
    ).toEqual(['Saved interview', 'Saved search', 'Saved segment']);
    expect(
        screen.getAllByRole('link').map((link) => link.getAttribute('href'))
    ).toEqual([
        '/project7/en/interviews/p001',
        '/project8/en/searches/archive?fulltext=history',
        '/project7/en/interviews/p001?tape=2&time=0h01m02s',
    ]);
    expect(useProjectDetail).toHaveBeenCalledWith(7);
    expect(useProjectDetail).toHaveBeenCalledWith(8);
    expect(WorkbookActions).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'saved_interviews' }));
    expect(container.querySelector('.panel')).toHaveClass('open');
    isMobile.mockReturnValue(true);
    fireEvent.click(screen.getAllByRole('link')[2]);
    expect(mockActions.setArchiveId).toHaveBeenCalledWith('p001');
    expect(mockActions.sendTimeChangeRequest).toHaveBeenCalledWith(2, 62);
    expect(mockActions.hideSidebar).toHaveBeenCalled();
});

test('project lists exclude other projects and retain entry actions', () => {
    useProject.mockReturnValue({ project: { id: 7, is_umbrella: false } });
    render(<WorkbookItemList type="saved_interviews" contents={contents} />);
    expect(screen.queryByText('Saved search')).not.toBeInTheDocument();
    expect(useProjectDetail).not.toHaveBeenCalledWith(8);
    expect(WorkbookActions.mock.lastCall[0]).toMatchObject({
        item: contents[2],
        itemPath: 'interviews/p001?tape=2&time=0h01m02s',
    });
});

test('lists wait for the current project and hide cached entries after an access error', () => {
    useProject.mockReturnValue({ isLoading: true, isUmbrella: true });
    const { rerender } = render(
        <WorkbookItemList type="saved_interviews" contents={contents} />
    );
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(screen.queryByText('Saved interview')).not.toBeInTheDocument();
    expect(useProjectDetail).not.toHaveBeenCalled();
    useProject.mockReturnValue({ project: { id: 7, is_umbrella: false } });
    rerender(<WorkbookItemList type="saved_interviews" contents={contents} />);
    expect(screen.getByText('Saved interview')).toBeInTheDocument();
    expect(useProject).toHaveBeenCalledWith({});
    useProject.mockReturnValue({
        project: { id: 7, is_umbrella: false },
        error: { message: 'Access denied' },
    });
    rerender(<WorkbookItemList type="saved_interviews" contents={contents} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Access denied');
    expect(screen.queryByText('Saved interview')).not.toBeInTheDocument();
});

test('unavailable entries stay visible and load their interview only after project details arrive', () => {
    mockInterviews = {};
    useProjectDetail.mockReturnValue({ project: undefined });
    const { rerender } = render(
        <WorkbookItemList type="saved_interviews" contents={[contents[0]]} />
    );
    expect(screen.getByText('Saved interview')).toBeInTheDocument();
    expect(
        screen.getByText('modules.workbook.project_unavailable')
    ).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(mockActions.fetchData).not.toHaveBeenCalled();

    const project = { id: 7, shortname: 'project7' };
    useProjectDetail.mockReturnValue({ project });
    rerender(
        <WorkbookItemList type="saved_interviews" contents={[contents[0]]} />
    );
    expect(screen.getByRole('link')).toHaveAttribute(
        'href',
        '/project7/en/interviews/p001'
    );
    expect(mockActions.fetchData).toHaveBeenCalledWith(
        { projectId: 'project7', locale: 'en', project },
        'interviews',
        'p001',
        'transcript_coupled'
    );
});

test('saved searches without an interview ID do not request interviews', () => {
    mockInterviews = {};
    render(<WorkbookItemList type="saved_searches" contents={[contents[1]]} />);
    expect(screen.getByRole('link')).toHaveAttribute(
        'href',
        '/project8/en/searches/archive?fulltext=history'
    );
    expect(mockActions.fetchData).not.toHaveBeenCalled();
});
