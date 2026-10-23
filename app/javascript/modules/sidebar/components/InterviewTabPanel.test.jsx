/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { useProject } from 'modules/routes';
import { MemoryRouter } from 'react-router-dom';

import InterviewTabPanel from './InterviewTabPanel';

jest.mock('modules/routes', () => ({
    useProject: jest.fn(),
    usePathBase: () => '/adg/de',
}));
jest.mock('modules/archive', () => ({ useIsEditor: () => false }));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
jest.mock('modules/auth', () => ({
    AuthorizedContent: ({ children, action }) =>
        action === 'show' ? children : null,
    AuthShowContainer: ({ children, hasProjectAccess, ifLoggedOut }) =>
        hasProjectAccess || ifLoggedOut ? children : null,
}));
jest.mock('modules/gallery', () => ({ GalleryContainer: () => null }));
jest.mock('modules/help-text', () => ({ HelpText: () => null }));
jest.mock('modules/interview-actions', () => ({
    DestroyTranscript: () => null,
    MarkTextFormContainer: () => null,
    UploadEditTableContainer: () => null,
    UploadTranscriptContainer: () => null,
}));
jest.mock('modules/interview-map', () => ({
    InterviewMap: () => <p>Interview map</p>,
}));
jest.mock('modules/interview-metadata', () => ({
    CitationInfoContainer: () => null,
    InterviewContributorsContainer: () => null,
    InterviewInfoContainer: () => <p>Interview metadata</p>,
    InterviewLinksField: () => null,
    InterviewTextMaterialsContainer: () => null,
}));
jest.mock('modules/materials', () => ({ MaterialList: () => null }));
jest.mock('modules/person', () => ({
    PersonDataContainer: () => <p>Person metadata</p>,
    usePersonWithAssociations: () => ({}),
}));
jest.mock('modules/react-toolbox', () => ({
    ErrorBoundary: ({ children }) => children,
}));
jest.mock('modules/registry-references', () => ({
    SelectedRegistryReferencesContainer: () => null,
}));
jest.mock('modules/spinners', () => ({ Spinner: () => <p>Loading</p> }));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));
jest.mock(
    './SubTab',
    () =>
        function SubTab({ children, title }) {
            return <section aria-label={title}>{children}</section>;
        }
);
jest.mock(
    './AdminActions',
    () =>
        function AdminActions() {
            return null;
        }
);
jest.mock(
    './AdminSubTab',
    () =>
        function AdminSubTab() {
            return null;
        }
);
jest.mock(
    './DownloadLinks',
    () =>
        function DownloadLinks() {
            return null;
        }
);

const props = {
    archiveId: 'adg001',
    projectId: 'adg',
    interview: { id: 1, archive_id: 'adg001' },
    setViewMode: jest.fn(),
    hideSidebar: jest.fn(),
    isLoggedIn: true,
};
const project = { has_map: true, is_catalog: false };

beforeEach(() => {
    useProject.mockReturnValue({ project });
});

test('sidebar waits for project details and hides retained tools after a project error', () => {
    useProject.mockReturnValue({ isLoading: true });
    const { rerender } = render(
        <MemoryRouter>
            <InterviewTabPanel {...props} />
        </MemoryRouter>
    );
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(screen.queryByText('Person metadata')).not.toBeInTheDocument();
    useProject.mockReturnValue({ project });
    rerender(
        <MemoryRouter>
            <InterviewTabPanel {...props} />
        </MemoryRouter>
    );
    expect(screen.getByText('Person metadata')).toBeInTheDocument();
    expect(useProject).toHaveBeenCalledWith({});
    useProject.mockReturnValue({
        project,
        error: { message: 'Access denied' },
    });
    rerender(
        <MemoryRouter>
            <InterviewTabPanel {...props} />
        </MemoryRouter>
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Access denied');
    expect(screen.queryByText('Person metadata')).not.toBeInTheDocument();
    expect(screen.queryByText('Interview map')).not.toBeInTheDocument();
});

test('catalog and map flags come from project details while Campscapes keeps its special visibility', () => {
    const { rerender } = render(
        <MemoryRouter>
            <InterviewTabPanel {...props} />
        </MemoryRouter>
    );
    expect(screen.getByText('Person metadata')).toBeInTheDocument();
    expect(screen.getByText('Interview map')).toBeInTheDocument();
    useProject.mockReturnValue({
        project: { has_map: false, is_catalog: true },
    });
    rerender(
        <MemoryRouter>
            <InterviewTabPanel {...props} />
        </MemoryRouter>
    );
    expect(screen.queryByText('Person metadata')).not.toBeInTheDocument();
    expect(screen.queryByText('Interview metadata')).not.toBeInTheDocument();
    expect(screen.queryByText('Interview map')).not.toBeInTheDocument();
    useProject.mockReturnValue({ project });
    rerender(
        <MemoryRouter>
            <InterviewTabPanel {...props} projectId="campscapes" />
        </MemoryRouter>
    );
    expect(screen.queryByText('Interview map')).not.toBeInTheDocument();
});
