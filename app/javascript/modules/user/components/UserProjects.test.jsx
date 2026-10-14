import { render } from '@testing-library/react';
import { fetchData } from 'modules/data';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import UserProjects from './UserProjects';

jest.mock('modules/data', () => ({
    fetchData: jest.fn(() => ({ type: 'fetch' })),
    getCurrentProject: (state) => state.currentProject,
    getCurrentUser: (state) => state.user,
    getProjects: (state) => state.projects,
    getProjectsStatus: (state) => state.statuses,
    useHydrateProjectsByIds: (...args) =>
        jest
            .requireActual('../../data/hooks/useHydrateProjectsByIds')
            .useHydrateProjectsByIds(...args),
}));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ locale: 'de' }) }));
jest.mock('./UserProject', () => () => null);

test('fetches missing user projects and skips projects already in the legacy store', () => {
    const initialState = {
        currentProject: { id: 1, shortname: 'ohd' },
        user: {
            user_projects: {
                1: { id: 1, project_id: 7 },
                2: { id: 2, project_id: 8 },
            },
        },
        projects: { 8: { id: 8 } },
        statuses: {},
    };
    const store = createStore((state = initialState) => state);
    render(
        <Provider store={store}>
            <UserProjects />
        </Provider>
    );
    expect(fetchData).toHaveBeenCalledTimes(1);
    expect(fetchData).toHaveBeenCalledWith(
        { locale: 'de', project: { id: 1, shortname: 'ohd' } },
        'projects',
        7
    );
});
