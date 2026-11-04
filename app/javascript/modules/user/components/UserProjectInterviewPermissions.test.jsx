/* eslint-disable react/prop-types */
import { fireEvent, render, screen } from '@testing-library/react';
import { fetchData } from 'modules/data';
import { useInterviewContributors } from 'modules/person';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import UserProjectInterviewPermissions from './UserProjectInterviewPermissions';

jest.mock('modules/data', () => ({
    fetchData: jest.fn(() => ({ type: 'TEST_FETCH' })),
    getInterviews: (state) => state.interviews,
    getInterviewsStatus: (state) => state.statuses,
}));
jest.mock('modules/person', () => ({ useInterviewContributors: jest.fn() }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'en', t: (key) => key }),
}));
jest.mock('modules/routes', () => ({
    LinkOrA: ({ project, to, children }) => (
        <a href={`${project.archive_domain}/${to}`}>{children}</a>
    ),
}));

const project = {
    id: 9,
    shortname: 'target',
    archive_domain: 'https://target.example.org',
};
const permissions = Object.freeze([
    { archive_id: 'target10' },
    { archive_id: 'target2' },
]);
const mockStore = configureStore();

/**
 * Opens a target-project permission section against cached interview records.
 * @param {Object} [state={}] - Interview records and their request statuses.
 * @returns {Object} Render controls.
 */
function renderPermissions(state = {}) {
    return render(
        <Provider store={mockStore({ interviews: {}, statuses: {}, ...state })}>
            <UserProjectInterviewPermissions
                project={project}
                interviewPermissions={permissions}
            />
        </Provider>
    );
}

beforeEach(() => {
    jest.clearAllMocks();
    useInterviewContributors.mockReturnValue({
        data: { 5: { id: 5, display_name: 'Interviewee' } },
    });
});

test('loads missing interviews in the owning project only when expanded and keeps links usable while loading', () => {
    renderPermissions({ statuses: { target10: 'fetching' } });
    expect(useInterviewContributors).not.toHaveBeenCalled();
    expect(fetchData).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    expect(fetchData).toHaveBeenCalledTimes(1);
    expect(fetchData).toHaveBeenCalledWith(
        { pathBase: '/target/en' },
        'interviews',
        'target2'
    );
    expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual(
        ['target2', 'target10']
    );
    expect(screen.getByRole('link', { name: 'target2' })).toHaveAttribute(
        'href',
        'https://target.example.org/interviews/target2'
    );
});

test('uses target-project names and localized titles without trusting cached interviews from another project', () => {
    renderPermissions({
        interviews: {
            target2: { id: 2, project_id: 9, interviewee_id: 5 },
            target10: {
                project_id: 7,
                interviewee_id: 5,
                short_title: { en: 'Wrong project' },
            },
        },
    });
    fireEvent.click(screen.getByRole('button'));
    expect(
        screen.getByRole('link', { name: 'Interviewee (target2)' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'target10' })).toBeInTheDocument();
    expect(screen.queryByText('Wrong project')).not.toBeInTheDocument();
    expect(useInterviewContributors).toHaveBeenCalledWith(2, project);
    expect(useInterviewContributors).toHaveBeenCalledWith(undefined, project);
    expect(fetchData).toHaveBeenCalledTimes(1);
    expect(fetchData).toHaveBeenCalledWith(
        { pathBase: '/target/en' },
        'interviews',
        'target10'
    );
});

test('falls back to localized titles when people are unavailable', () => {
    useInterviewContributors.mockReturnValue({});
    renderPermissions({
        interviews: {
            target2: { project_id: 9, short_title: { en: 'Short title' } },
            target10: {
                project_id: 9,
                anonymous_title: { en: 'Anonymous title' },
            },
        },
    });
    fireEvent.click(screen.getByRole('button'));
    expect(
        screen.getByRole('link', { name: 'Short title (target2)' })
    ).toBeInTheDocument();
    expect(
        screen.getByRole('link', { name: 'Anonymous title (target10)' })
    ).toBeInTheDocument();
    expect(fetchData).not.toHaveBeenCalled();
});
