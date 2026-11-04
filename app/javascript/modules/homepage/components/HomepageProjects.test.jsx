/* eslint-disable react/prop-types */
import { fireEvent, render, screen, within } from '@testing-library/react';
import { useProjectAccessStatus } from 'modules/auth';
import { useProjectList } from 'modules/data';
import { useIsMobile } from 'modules/user-agent';

import { HomepageProjects } from './HomepageProjects';

jest.mock('modules/data', () => ({ useProjectList: jest.fn() }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key, locale: 'en' }),
}));
jest.mock('modules/user-agent', () => ({ useIsMobile: jest.fn() }));
jest.mock('modules/auth', () => ({
    useProjectAccessStatus: jest.fn(),
    PROJECT_ACCESS_REQUESTED: 'project_access_requested',
}));
jest.mock('modules/ui', () => ({
    SmartImage: ({ src, alt }) => <img src={src} alt={alt} />,
}));
jest.mock('modules/routes', () => ({
    LinkOrA: ({ children, project, className }) => (
        <a className={className} href={`/${project.shortname}/en`}>
            {children}
        </a>
    ),
}));

/**
 * Builds summaries with increasing interview counts for ranking tests.
 *
 * @param {number} id - Project ID and interview count.
 * @returns {Object} Project summary with a localized name.
 */
const project = (id) => ({
    id,
    shortname: `project${id}`,
    name: `Project ${id}`,
    interview_counts: { total: id },
});

beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    useProjectList.mockReturnValue({ projects: [project(1)] });
    useProjectAccessStatus.mockReturnValue({ projectAccessGranted: true });
    useIsMobile.mockReturnValue(false);
});

afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    jest.clearAllMocks();
});

test('requests public summaries and selects the largest 21 projects before shuffling', () => {
    const projects = Array.from({ length: 23 }, (_, index) =>
        project(index + 1)
    );
    useProjectList.mockReturnValue({ projects });
    render(<HomepageProjects />);
    expect(useProjectList).toHaveBeenCalledWith({
        all: true,
        workflowState: 'public',
        include: ['counts', 'institutions'],
    });
    expect(
        screen
            .getAllByRole('heading', { level: 4 })
            .map((heading) => heading.textContent)
    ).toEqual(
        Array.from({ length: 21 }, (_, index) => `Project ${23 - index}`)
    );
    expect(projects.map(({ id }) => id)).toEqual(
        Array.from({ length: 23 }, (_, index) => index + 1)
    );
    expect(Math.random).toHaveBeenCalled();
});

test('keeps incoming API order for equal counts before shuffling and treats missing counts as zero', () => {
    useProjectList.mockReturnValue({
        projects: [
            { ...project(3), interview_counts: { total: 5 } },
            { ...project(2), interview_counts: { total: 5 } },
            { ...project(1), interview_counts: undefined },
        ],
    });
    render(<HomepageProjects />);
    expect(
        screen
            .getAllByRole('heading', { level: 4 })
            .map((heading) => heading.textContent)
    ).toEqual(['Project 3', 'Project 2', 'Project 1']);
    expect(
        within(screen.getByTestId('homepage-project-tile-1')).getByText(
            '0 activerecord.models.interview.other'
        )
    ).toBeInTheDocument();
});

test('renders localized names institutions logos and access status from the summary', () => {
    const summary = {
        ...project(1),
        display_name: 'Display name',
        institutions: [{ name: 'Institute' }, { name: null }],
        logo: { url: '/logo.png' },
    };
    useProjectList.mockReturnValue({ projects: [summary] });
    useProjectAccessStatus.mockReturnValue({
        projectAccessGranted: false,
        projectAccessStatus: 'project_access_requested',
    });
    render(<HomepageProjects />);
    expect(
        screen.getByRole('heading', { name: 'Display name' })
    ).toBeInTheDocument();
    expect(screen.getByText('Institute')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Display name' })).toHaveAttribute(
        'src',
        '/logo.png'
    );
    expect(
        screen.getByText('1 activerecord.models.interview.one')
    ).toBeInTheDocument();
    expect(screen.getByTestId('homepage-project-tile-lock-1')).toHaveAttribute(
        'aria-label',
        'modules.homepage.access_requested'
    );
    expect(useProjectAccessStatus).toHaveBeenCalledWith(summary);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/project1/en');
});

test('shows no tiles before the list arrives and updates them from later Redux selections', () => {
    useProjectList.mockReturnValue({ projects: [], isLoading: true });
    const { rerender } = render(<HomepageProjects />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    useProjectList.mockReturnValue({
        projects: [project(2)],
        isValidating: true,
    });
    rerender(<HomepageProjects />);
    expect(
        screen.getByRole('heading', { name: 'Project 2' })
    ).toBeInTheDocument();
    useProjectList.mockReturnValue({
        projects: [{ ...project(2), name: 'Projekt' }],
    });
    rerender(<HomepageProjects />);
    expect(
        screen.getByRole('heading', { name: 'Projekt' })
    ).toBeInTheDocument();
});

test.each([false, true])(
    'preserves carousel navigation and stops automatic scrolling after interaction (mobile=%s)',
    (mobile) => {
        useIsMobile.mockReturnValue(mobile);
        render(<HomepageProjects />);
        const scroll = screen.getByTestId('homepage-projects-scroll');
        Object.defineProperties(scroll, {
            clientWidth: { value: 100 },
            scrollWidth: { value: 500 },
        });
        Object.defineProperty(scroll.firstElementChild, 'offsetWidth', {
            value: 100,
        });
        scroll.scrollBy = jest.fn();
        fireEvent.scroll(scroll);
        fireEvent.click(screen.getByTestId('homepage-projects-nav-next'));
        expect(scroll.scrollBy).toHaveBeenCalledWith({
            left: mobile ? 100 : 300,
            behavior: 'smooth',
        });
        jest.advanceTimersByTime(3000);
        expect(scroll.scrollBy).toHaveBeenCalledTimes(1);
    }
);
