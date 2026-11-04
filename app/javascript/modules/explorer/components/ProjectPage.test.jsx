/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { useProjectDetail } from 'modules/data';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { ProjectPage } from './ProjectPage';

jest.mock('modules/data', () => ({ useProjectDetail: jest.fn() }));
jest.mock('modules/analytics', () => ({ useTrackPageView: () => {} }));
jest.mock('modules/archive', () => ({ useIsEditor: () => false }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key, locale: 'en' }),
    pluralizeKey: (key) => key,
}));
jest.mock('modules/react-toolbox', () => ({
    ErrorBoundary: ({ children }) => children,
}));
jest.mock('modules/user-agent', () => ({
    ScrollToTop: ({ children }) => children,
}));
jest.mock('modules/spinners', () => ({
    Spinner: () => <div role="status">Loading</div>,
}));
jest.mock('modules/ui', () => ({
    LinkButton: ({ buttonText, to }) => <a href={to}>{buttonText}</a>,
    SmartImage: ({ src, alt }) => <img src={src} alt={alt} />,
    CopyText: () => null,
}));
jest.mock('./CollectionList', () => ({
    __esModule: true,
    default: ({ project }) => <div>Collections for {project.shortname}</div>,
}));

/**
 * Renders the catalog detail route with its project ID available to the page.
 *
 * @returns {Object} Testing Library render result.
 */
function renderPage() {
    return render(
        <MemoryRouter initialEntries={['/en/catalog/archives/7']}>
            <Routes>
                <Route
                    path="/:locale/catalog/archives/:id"
                    element={<ProjectPage />}
                />
            </Routes>
        </MemoryRouter>
    );
}

test('requests catalog includes and displays details with primary-institution citation and collection links', () => {
    useProjectDetail.mockReturnValue({
        project: {
            id: 7,
            shortname: 'archive',
            name: 'Archive',
            introduction: '<p>Project introduction</p>',
            domain: 'https://example.test',
            interview_counts: { total: 12, public: 12, restricted: 0 },
            interview_languages: ['eng', 'deu'],
            media_types: { audio: 9, video: 3 },
            birth_year_range: { min: 1920, max: 1930 },
            interview_year_range: { min: 1980, max: 1990 },
            subjects: ['Migration'],
            levels_of_indexing: [{ descriptor: 'Transcript', count: 12 }],
            leaders: [
                {
                    name: 'Ada Lovelace',
                    name_type: 'Personal',
                    first_name: 'Ada',
                    last_name: 'Lovelace',
                },
            ],
            cooperation_partners: [
                { name: 'Museum', name_type: 'Organizational' },
            ],
            managers: [{ name: 'Archive manager' }],
            funders: [{ name: 'Foundation' }],
            institutions: [
                { id: 1, name: 'Secondary', is_primary: false },
                { id: 2, name: 'Primary', is_primary: true },
            ],
        },
    });
    const { container } = renderPage();
    expect(useProjectDetail).toHaveBeenCalledWith('7', {
        include: expect.arrayContaining([
            'counts',
            'institutions',
            'interview_languages',
            'media_types',
            'year_ranges',
            'subjects',
            'levels_of_indexing',
            'affiliates',
        ]),
    });
    expect(
        screen.getByRole('heading', { name: 'Archive' })
    ).toBeInTheDocument();
    for (const text of [
        'Project introduction',
        'deu, eng',
        'Migration',
        '12 Transcript',
        'Ada Lovelace',
        'Museum',
        'Archive manager',
        'Foundation',
        'Collections for archive',
    ])
        expect(screen.getByText(text)).toBeInTheDocument();
    expect(
        screen.getByText(/12 activerecord.models.interview.other/)
    ).toBeInTheDocument();
    expect(
        screen.getByText('9 modules.catalog.audios, 3 modules.catalog.videos')
    ).toBeInTheDocument();
    expect(screen.getByText(/1920.*1930/)).toBeInTheDocument();
    expect(screen.getByText(/1980.*1990/)).toBeInTheDocument();
    const citation = container.querySelector(
        '.DescriptionList-group--citation'
    );
    expect(citation).toHaveTextContent('Primary');
    expect(citation).not.toHaveTextContent('Secondary');
    expect(
        screen.getAllByRole('link', { name: 'explorer.view_project_page' })[0]
    ).toHaveAttribute('href', '/archive/en');
});

test('shows loading and denied access without rendering cached project content', () => {
    useProjectDetail.mockReturnValue({ isLoading: true });
    const { rerender } = renderPage();
    expect(screen.getByRole('status')).toHaveTextContent('Loading');
    useProjectDetail.mockReturnValue({
        error: { status: 403, message: 'Denied' },
        project: { name: 'Cached protected name' },
    });
    rerender(<ProjectPage />);
    expect(screen.getByRole('alert')).toHaveTextContent('Denied');
    expect(screen.queryByText('Cached protected name')).not.toBeInTheDocument();
});
