/* eslint-disable react/prop-types */
import { fireEvent, render, screen } from '@testing-library/react';
import { useAuthorization } from 'modules/auth';
import { useProject } from 'modules/routes';
import { MemoryRouter, useLocation } from 'react-router-dom';

import SidebarTabs from './SidebarTabs';

jest.mock('modules/routes', () => ({
    useProject: jest.fn(),
    usePathBase: () => '/pilot/en',
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({
        locale: 'en',
        t: (key, params) =>
            params?.project ? `${key}: ${params.project}` : key,
    }),
}));
jest.mock('modules/auth', () => ({ useAuthorization: jest.fn() }));
jest.mock('modules/data', () => ({
    StateCheck: ({ children }) => children,
    getCurrentInterviewFetched: jest.fn(),
}));
jest.mock('modules/spinners', () => ({ Spinner: () => <p>Loading</p> }));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));
jest.mock(
    './ArchiveSearchTabPanel',
    () =>
        function Search() {
            return <p>Search controls</p>;
        }
);
jest.mock(
    './IndexingTabPanel',
    () =>
        function Indexing() {
            return null;
        }
);
jest.mock(
    './AdminTabPanel',
    () =>
        function Admin() {
            return null;
        }
);
jest.mock(
    './InterviewTabPanelContainer',
    () =>
        function Interview() {
            return <p>Interview controls</p>;
        }
);
jest.mock(
    './MapTabPanelContainer',
    () =>
        function Map() {
            return null;
        }
);
jest.mock(
    './ProjectConfigTabPanel',
    () =>
        function Config() {
            return null;
        }
);
jest.mock(
    './RegistryEntriesTabPanelContainer',
    () =>
        function Registry() {
            return null;
        }
);
jest.mock(
    './WorkbookTabPanel',
    () =>
        function Workbook() {
            return null;
        }
);

const project = {
    shortname: 'pilot',
    name: 'Localized name',
    is_umbrella: false,
    has_map: true,
    logged_out_visible_registry_entry_ids: ['7'],
};

beforeEach(() => {
    jest.clearAllMocks();
    useProject.mockReturnValue({ project });
    useAuthorization.mockReturnValue({ isAuthorized: () => false });
});

test('waits for project settings and hides retained tabs when access fails', () => {
    useProject.mockReturnValue({ isLoading: true });
    const { rerender } = render(
        <MemoryRouter>
            <SidebarTabs />
        </MemoryRouter>
    );
    expect(useProject).toHaveBeenCalledWith({
        include: ['registry_configuration'],
    });
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    useProject.mockReturnValue({
        project,
        error: { message: 'Access denied' },
    });
    rerender(
        <MemoryRouter>
            <SidebarTabs />
        </MemoryRouter>
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Access denied');
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
});

test('preserves visitor registry visibility, project map settings, and permission controls', () => {
    const { rerender } = render(
        <MemoryRouter>
            <SidebarTabs />
        </MemoryRouter>
    );
    expect(screen.getByRole('tab', { name: 'registry' })).not.toBeDisabled();
    expect(screen.getByRole('tab', { name: 'map' })).not.toBeDisabled();
    expect(
        screen.getByRole('tab', { name: 'modules.sidebar.catalog' })
    ).toBeDisabled();
    expect(screen.getByRole('tab', { name: 'edit.indexing' })).toBeDisabled();
    useProject.mockReturnValue({
        project: {
            ...project,
            has_map: false,
            logged_out_visible_registry_entry_ids: [],
        },
    });
    rerender(
        <MemoryRouter>
            <SidebarTabs />
        </MemoryRouter>
    );
    expect(screen.getByRole('tab', { name: 'registry' })).toBeDisabled();
    expect(screen.getByRole('tab', { name: 'map' })).toBeDisabled();
    useProject.mockReturnValue({
        project: {
            ...project,
            is_umbrella: true,
            logged_out_visible_registry_entry_ids: [],
        },
    });
    useAuthorization.mockReturnValue({ isAuthorized: () => true });
    rerender(
        <MemoryRouter>
            <SidebarTabs isLoggedIn />
        </MemoryRouter>
    );
    expect(screen.getByRole('tab', { name: 'registry' })).not.toBeDisabled();
    expect(screen.getByRole('tab', { name: 'map' })).toBeDisabled();
    expect(
        screen.getByRole('tab', { name: 'modules.sidebar.catalog' })
    ).not.toBeDisabled();
    expect(
        screen.getByRole('tab', { name: 'edit.indexing' })
    ).not.toBeDisabled();
    expect(
        screen.getByRole('tab', { name: 'edit.projects.admin' })
    ).not.toBeDisabled();
});

test('uses the localized Campscapes name and keeps interview navigation by public identifier', () => {
    useProject.mockReturnValue({
        project: { ...project, shortname: 'campscapes' },
    });
    function Location() {
        const location = useLocation();
        return <p>{location.pathname}</p>;
    }
    const { rerender } = render(
        <MemoryRouter>
            <SidebarTabs />
            <Location />
        </MemoryRouter>
    );
    expect(
        screen.getByRole('tab', {
            name: 'user.notes_on_tos_agreement: Localized name',
        })
    ).toBeInTheDocument();
    rerender(
        <MemoryRouter>
            <SidebarTabs
                interview={{ archive_id: 'pilot001' }}
                archiveId="pilot001"
            />
            <Location />
        </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('tab', { name: 'interview' }));
    expect(
        screen.getByText('/pilot/en/interviews/pilot001')
    ).toBeInTheDocument();
    expect(screen.getByText('Interview controls')).toBeInTheDocument();
});
