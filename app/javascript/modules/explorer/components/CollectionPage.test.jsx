/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { useGetCollection, useProjectDetail } from 'modules/data';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { CollectionPage } from './CollectionPage';

let mockLocale = 'en';
jest.mock('modules/data', () => ({
    useGetCollection: jest.fn(),
    useProjectDetail: jest.fn(),
}));
jest.mock('modules/analytics', () => ({ useTrackPageView: () => {} }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key, locale: mockLocale }),
}));
jest.mock('modules/react-toolbox', () => ({
    ErrorBoundary: ({ children }) => children,
}));
jest.mock('modules/user-agent', () => ({
    ScrollToTop: ({ children }) => children,
}));
jest.mock('modules/ui', () => ({
    LinkButton: ({ buttonText, to }) => <a href={to}>{buttonText}</a>,
    CopyText: () => null,
}));

const collection = {
    id: 42,
    project_id: 7,
    project_name: 'Old embedded project name',
    name: { en: 'Collection', de: 'Sammlung' },
    notes: { en: 'Collection notes', de: 'Beschreibung' },
    interviews: { total: 3, public: 3, restricted: 0 },
    is_linkable: true,
};
const project = {
    id: 7,
    shortname: 'project',
    name: 'Project name',
    display_name: 'Project display name',
    is_catalog: false,
    institutions: [
        { id: 1, name: 'Secondary', is_primary: false },
        { id: 2, name: 'Primary', is_primary: true },
    ],
};

/**
 * Renders collection details with route parameters preserved across rerenders.
 *
 * @returns {Object} Testing Library render result.
 */
function renderPage() {
    return render(<CollectionPage />, {
        wrapper: ({ children }) => (
            <MemoryRouter initialEntries={['/en/catalog/collections/42']}>
                <Routes>
                    <Route
                        path="/:locale/catalog/collections/:id"
                        element={children}
                    />
                </Routes>
            </MemoryRouter>
        ),
    });
}

beforeEach(() => {
    jest.clearAllMocks();
    mockLocale = 'en';
    useGetCollection.mockReturnValue({ collection });
    useProjectDetail.mockReturnValue({ project });
});

test('uses Redux project names and institutions while retaining collection counts and links', () => {
    const { container } = renderPage();
    expect(useGetCollection).toHaveBeenCalledWith('42');
    expect(useProjectDetail).toHaveBeenCalledWith(7, {
        include: ['institutions'],
    });
    expect(
        screen.getByRole('heading', { name: 'Collection' })
    ).toBeInTheDocument();
    expect(screen.getByText('Collection notes')).toBeInTheDocument();
    expect(
        screen.getByText(/3 activerecord.models.interview.other/)
    ).toBeInTheDocument();
    expect(
        screen.getByRole('link', { name: 'Project display name' })
    ).toHaveAttribute('href', '/en/catalog/archives/7');
    expect(
        screen.queryByText('Old embedded project name')
    ).not.toBeInTheDocument();
    const citation = container.querySelector(
        '.DescriptionList-group--citation'
    );
    expect(citation).toHaveTextContent('Primary');
    expect(citation).not.toHaveTextContent('Secondary');
    expect(
        screen.getAllByRole('link', {
            name: 'explorer.view_collection_page',
        })[0]
    ).toHaveAttribute(
        'href',
        '/project/en/searches/archive?collection_id[]=42'
    );
});

test('waits for the collection project ID and then its project details', () => {
    useGetCollection.mockReturnValue({ isLoading: true });
    useProjectDetail.mockReturnValue({});
    const { rerender } = renderPage();
    expect(useProjectDetail).toHaveBeenLastCalledWith(undefined, {
        include: ['institutions'],
    });
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    useGetCollection.mockReturnValue({ collection });
    rerender(<CollectionPage />);
    expect(useProjectDetail).toHaveBeenLastCalledWith(7, {
        include: ['institutions'],
    });
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    useProjectDetail.mockReturnValue({ project });
    rerender(<CollectionPage />);
    expect(
        screen.getByRole('heading', { name: 'Collection' })
    ).toBeInTheDocument();
});

test('uses the current locale for project labels and external collection links', () => {
    const { rerender } = renderPage();
    mockLocale = 'de';
    useProjectDetail.mockReturnValue({
        project: {
            ...project,
            display_name: 'Projekt',
            archive_domain: 'https://project.test',
        },
    });
    rerender(<CollectionPage />);
    expect(
        screen.getByRole('heading', { name: 'Sammlung' })
    ).toBeInTheDocument();
    expect(screen.getByText('Beschreibung')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Projekt' })).toHaveAttribute(
        'href',
        '/de/catalog/archives/7'
    );
    expect(
        screen.getAllByRole('link', {
            name: 'explorer.view_collection_page',
        })[0]
    ).toHaveAttribute(
        'href',
        'https://project.test/de/searches/archive?collection_id[]=42'
    );
});

test('shows denied project access even with a cached collection and project', () => {
    useProjectDetail.mockReturnValue({
        project,
        error: { status: 403, message: 'Project access denied' },
    });
    renderPage();
    expect(screen.getByRole('alert')).toHaveTextContent(
        'Project access denied'
    );
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(
        screen.queryByRole('link', { name: 'Project display name' })
    ).not.toBeInTheDocument();
});

test('shows collection request errors before a project ID is available', () => {
    useGetCollection.mockReturnValue({
        error: { message: 'Collection not found' },
    });
    useProjectDetail.mockReturnValue({});
    renderPage();
    expect(screen.getByRole('alert')).toHaveTextContent('Collection not found');
});
