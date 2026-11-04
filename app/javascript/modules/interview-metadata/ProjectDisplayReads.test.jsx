/* eslint-disable react/prop-types */
import { fireEvent, render, screen } from '@testing-library/react';
import { useAuthorization, useProjectAccessStatus } from 'modules/auth';
import { SingleValueWithForm } from 'modules/forms';
import { useProject } from 'modules/routes';

import CitationInfo from './CitationInfo';
import InterviewCollectionInfo from './InterviewCollectionInfo';
import InterviewTextMaterials from './InterviewTextMaterials';

jest.mock('modules/routes', () => ({
    useProject: jest.fn(),
    usePathBase: () => '/pilot/de',
}));
jest.mock('modules/constants', () => ({
    OHD_LOCATION: 'https://portal.example',
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key, locale: 'de' }),
}));
jest.mock('modules/auth', () => ({
    useAuthorization: jest.fn(),
    useProjectAccessStatus: jest.fn(),
    AuthShowContainer: ({ children }) => children,
}));
jest.mock('modules/data', () => ({
    FetchProjectResource: ({ children }) => children,
    getCollectionsForCurrentProject: jest.fn(),
}));
const mockCollections = {
    2: {
        id: 2,
        name: { de: 'Collection' },
        notes: { de: 'Collection description' },
        workflow_state: 'public',
    },
};
jest.mock('react-redux', () => ({ useSelector: () => mockCollections }));
jest.mock('modules/utils', () => ({ sanitizeHtml: (html) => html }));
jest.mock('modules/spinners', () => ({ Spinner: () => <p>Loading</p> }));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));
jest.mock('modules/forms', () => ({
    SingleValueWithForm: jest.fn(({ children }) => (
        <div>Editable value{children}</div>
    )),
    StatusForm: () => <span>Transcript visibility</span>,
}));
jest.mock(
    './CatalogLink',
    () =>
        function CatalogLink() {
            return <a href="/catalog/collections/2">Catalog</a>;
        }
);
jest.mock(
    './InterviewDownloads',
    () =>
        function Download({ lang, type }) {
            return (
                <a href={`/${type}/${lang}`}>
                    {type} {lang}
                </a>
            );
        }
);

const project = {
    id: 7,
    shortname: 'pilot',
    name: 'Localized project',
    available_locales: ['de', 'en'],
    is_catalog: false,
};
const interview = {
    id: 99,
    archive_id: 'pilot001',
    collection_id: 2,
    language_id: 3,
    interview_date: '2020-01-01',
    doi_status: 'created',
    used_doi_prefix: '10.123',
    properties: {
        public_attributes: { observations: 'true', transcript: 'true' },
    },
    observations: { de: 'Text', en: '  ', fr: 'Other text' },
    alpha3s_with_transcript: ['deu'],
};

beforeEach(() => {
    jest.clearAllMocks();
    useProject.mockReturnValue({ project });
    useAuthorization.mockReturnValue({ isAuthorized: () => false });
    useProjectAccessStatus.mockReturnValue({ projectAccessGranted: true });
});

test.each([CitationInfo, InterviewCollectionInfo, InterviewTextMaterials])(
    '%p waits for project data and hides retained content on failure',
    (Component) => {
        useProject.mockReturnValue({ isLoading: true });
        const { rerender } = render(
            <Component interview={interview} collections={mockCollections} />
        );
        expect(screen.getByText('Loading')).toBeInTheDocument();
        expect(useProject).toHaveBeenCalledWith({});
        useProject.mockReturnValue({
            project,
            error: { message: 'Access denied' },
        });
        rerender(
            <Component interview={interview} collections={mockCollections} />
        );
        expect(screen.getByRole('alert')).toHaveTextContent('Access denied');
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
        expect(screen.queryByText('Editable value')).not.toBeInTheDocument();
    }
);

test.each([null, 'https://project.example'])(
    'citation uses localized name and public identifiers with domain %s',
    (domain) => {
        useProject.mockReturnValue({
            project: { ...project, archive_domain: domain },
        });
        render(
            <CitationInfo interview={interview} collections={mockCollections} />
        );
        expect(screen.getByText(/Localized project/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /doi.org/ })).toHaveAttribute(
            'href',
            'https://doi.org/10.123/pilot.pilot001'
        );
        expect(
            screen.getByRole('link', { name: /interviews/ })
        ).toHaveAttribute(
            'href',
            `${domain || 'https://portal.example'}/pilot/de/interviews/pilot001`
        );
    }
);

test('collection display preserves project access, disclosure, and unshared visibility', () => {
    const { rerender } = render(
        <InterviewCollectionInfo interview={interview} />
    );
    expect(useProjectAccessStatus).toHaveBeenCalledWith(project);
    expect(SingleValueWithForm.mock.calls.at(-1)[0]).toMatchObject({
        projectAccessGranted: true,
        value: 'Collection',
        values: mockCollections,
    });
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Collection description')).toBeVisible();
    useProjectAccessStatus.mockReturnValue({ projectAccessGranted: false });
    rerender(<InterviewCollectionInfo interview={interview} />);
    expect(SingleValueWithForm.mock.calls.at(-1)[0]).toMatchObject({
        projectAccessGranted: false,
    });
    mockCollections[2].workflow_state = 'unshared';
    rerender(<InterviewCollectionInfo interview={interview} />);
    expect(screen.queryByText('Editable value')).not.toBeInTheDocument();
    mockCollections[2].workflow_state = 'public';
});

test('materials use configured locales and hide transcripts in catalog projects', () => {
    const { rerender } = render(
        <InterviewTextMaterials interview={interview} />
    );
    expect(
        screen.getByRole('link', { name: 'observations de' })
    ).toBeInTheDocument();
    expect(
        screen.queryByRole('link', { name: 'observations en' })
    ).not.toBeInTheDocument();
    expect(
        screen.queryByRole('link', { name: 'observations fr' })
    ).not.toBeInTheDocument();
    expect(
        screen.getByRole('link', { name: 'transcript deu' })
    ).toBeInTheDocument();
    useProject.mockReturnValue({ project: { ...project, is_catalog: true } });
    rerender(<InterviewTextMaterials interview={interview} />);
    expect(
        screen.queryByRole('link', { name: 'transcript deu' })
    ).not.toBeInTheDocument();
});

test('private materials remain hidden from visitors and available to authorized editors', () => {
    const privateInterview = { ...interview, properties: {} };
    const { rerender } = render(
        <InterviewTextMaterials interview={privateInterview} />
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    useAuthorization.mockReturnValue({ isAuthorized: () => true });
    rerender(<InterviewTextMaterials interview={privateInterview} editView />);
    expect(
        screen.getByRole('link', { name: 'observations de' })
    ).toBeInTheDocument();
    expect(
        screen.getByRole('link', { name: 'transcript deu' })
    ).toBeInTheDocument();
    expect(screen.getByText('Editable value')).toBeInTheDocument();
});
