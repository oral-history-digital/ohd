/* eslint-disable react/prop-types */
import { fireEvent, render, screen } from '@testing-library/react';
import { useAuthorization } from 'modules/auth';
import { useProjectDetail } from 'modules/data';
import { useInterviewSearch } from 'modules/interview-search';
import { WorkbookItemForm } from 'modules/workbook';

import InterviewListRow from './InterviewListRow';
import InterviewPreview from './InterviewPreview';

jest.mock('modules/data', () => ({
    ...jest.requireActual('../data/utils/getResultMetadataFields'),
    useProjectDetail: jest.fn(),
    getCurrentUser: () => null,
    useCurrentProject: () => ({ project: { is_umbrella: true } }),
    useHumanReadable: () => ({
        humanReadable: ({ obj, attribute }) => obj[attribute],
    }),
}));
jest.mock('react-redux', () => ({ useSelector: (selector) => selector() }));
jest.mock('modules/auth', () => ({
    useAuthorization: jest.fn(),
    useProjectAccessStatus: (...args) =>
        jest
            .requireActual('../auth/projectAccessStatus-hook')
            .useProjectAccessStatus(...args),
    AuthorizedContent: ({ children }) => children,
    PROJECT_ACCESS_REQUESTED: 'project_access_requested',
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'en', t: (key) => key }),
}));
jest.mock('modules/routes', () => ({
    useProject: () => ({
        project: {
            is_umbrella: true,
            metadata_fields: [
                {
                    id: 1,
                    name: 'description',
                    source: 'Interview',
                    use_in_results_list: true,
                },
            ],
        },
    }),
    LinkOrA: ({ project, to, onLinkClick, children }) =>
        project ? (
            <a href={`/${project.shortname}/en/${to}`} onClick={onLinkClick}>
                {children}
            </a>
        ) : (
            <span>{children}</span>
        ),
}));
jest.mock('modules/search', () => ({
    useArchiveSearch: () => ({ fulltext: 'history' }),
}));
jest.mock('modules/interview-search', () => ({
    useInterviewSearch: jest.fn(),
    SlideShowSearchResults: ({ project }) => (
        <p>Segments from {project.shortname}</p>
    ),
}));
jest.mock('modules/person', () => ({
    usePersonWithAssociations: () => ({ data: {} }),
}));
jest.mock('modules/events', () => ({ formatEventShort: jest.fn() }));
jest.mock('modules/interview-helpers', () => ({
    MediaIcon: () => <span>No image</span>,
}));
jest.mock('modules/ui', () => ({
    Modal: ({ children }) => children(() => {}),
    Checkbox: ({ checked, onChange }) => (
        <input type="checkbox" checked={checked} onChange={onChange} />
    ),
}));
jest.mock('modules/workbook', () => ({
    useWorkbook: () => ({ savedInterviews: [] }),
    WorkbookItemForm: jest.fn(() => null),
}));
jest.mock('./ThumbnailMetadata', () => () => null);

const project = {
    id: 7,
    shortname: 'other',
    name: 'Project name',
    display_name: 'Display name',
    show_preview_img: true,
};
const interview = {
    id: 9,
    project_id: 7,
    archive_id: 'other001',
    workflow_state: 'public',
    short_title: { en: 'Full interview title' },
    anonymous_title: { en: 'Anonymous title' },
    description: 'Current project column',
    still_url: '/still.jpg',
};
const props = {
    interview,
    selectedArchiveIds: ['dummy'],
    setArchiveId: jest.fn(),
    addRemoveArchiveId: jest.fn(),
};

beforeEach(() => {
    jest.clearAllMocks();
    useProjectDetail.mockReturnValue({ project });
    useAuthorization.mockReturnValue({ isAuthorized: () => false });
    useInterviewSearch.mockReturnValue({ numResults: 2, data: {} });
});

test('card uses display details for links, names, preview images, bookmarks, and search results', () => {
    const { container } = render(
        <InterviewPreview {...props} statuses={{}} isLoggedIn />
    );
    expect(useProjectDetail).toHaveBeenCalledWith(7);
    expect(screen.getByRole('link')).toHaveAttribute(
        'href',
        '/other/en/interviews/other001?fulltext=history'
    );
    expect(screen.getByText('Display name')).toBeInTheDocument();
    expect(
        container.querySelector('img[src="/still.jpg"]')
    ).toBeInTheDocument();
    expect(screen.getByText('Anonymous title')).toBeInTheDocument();
    expect(screen.queryByText('Full interview title')).not.toBeInTheDocument();
    expect(WorkbookItemForm.mock.lastCall[0].project).toBe(project);
    expect(useInterviewSearch).toHaveBeenCalledWith(
        'other001',
        'history',
        project
    );
    fireEvent.click(screen.getByRole('link'));
    expect(props.setArchiveId).toHaveBeenCalledWith('other001');
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Segments from other')).toBeInTheDocument();
});

test('card waits for project details before linking or bookmarking, and honors disabled public preview images', () => {
    useProjectDetail.mockReturnValue({ project: undefined });
    const { container, rerender } = render(
        <InterviewPreview {...props} statuses={{}} isLoggedIn />
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(WorkbookItemForm).not.toHaveBeenCalled();
    expect(
        container.querySelector('img[src="/still.jpg"]')
    ).not.toBeInTheDocument();

    useProjectDetail.mockReturnValue({
        project: { ...project, show_preview_img: false },
    });
    rerender(<InterviewPreview {...props} statuses={{}} isLoggedIn />);
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(
        container.querySelector('img[src="/still.jpg"]')
    ).not.toBeInTheDocument();
    useProjectDetail.mockReturnValue({
        project: {
            ...project,
            show_preview_img: false,
            grant_access_without_login: true,
        },
    });
    rerender(<InterviewPreview {...props} statuses={{}} isLoggedIn />);
    expect(
        container.querySelector('img[src="/still.jpg"]')
    ).toBeInTheDocument();
    expect(screen.getByText('Full interview title')).toBeInTheDocument();
});

test('list row uses the interview project for links and access while keeping current-project metadata columns', () => {
    useProjectDetail.mockReturnValue({
        project: { ...project, grant_access_without_login: true },
    });
    useAuthorization.mockReturnValue({ isAuthorized: () => true });
    render(
        <table>
            <tbody>
                <InterviewListRow {...props} />
            </tbody>
        </table>
    );
    expect(useProjectDetail).toHaveBeenCalledWith(7);
    expect(screen.getByText('Display name')).toBeInTheDocument();
    expect(screen.getByText('Current project column')).toBeInTheDocument();
    expect(
        screen.getByRole('link', { name: 'Full interview title' })
    ).toHaveAttribute('href', '/other/en/interviews/other001?fulltext=history');
    expect(screen.getByRole('link', { name: '2' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('checkbox'));
    expect(props.addRemoveArchiveId).toHaveBeenCalledWith('other001');
});

test('restricted rows keep anonymous titles and hide metadata without permission', () => {
    render(
        <table>
            <tbody>
                <InterviewListRow
                    {...props}
                    interview={{ ...interview, workflow_state: 'restricted' }}
                />
            </tbody>
        </table>
    );
    expect(screen.getByText('Anonymous title')).toBeInTheDocument();
    expect(screen.queryByText('Full interview title')).not.toBeInTheDocument();
    expect(screen.getByText('---')).toBeInTheDocument();
});
