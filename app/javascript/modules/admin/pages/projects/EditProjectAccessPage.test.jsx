/* eslint-disable react/prop-types */
import { act, fireEvent, render, screen } from '@testing-library/react';
import Loader from 'modules/api/Loader';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

import { dataReducer } from '../../../data/redux/reducer';
import { EditData } from '../../components';
import EditProjectAccessPage from './EditProjectAccessPage';

jest.mock('modules/api/Loader', () => ({
    __esModule: true,
    default: { getJson: jest.fn(), put: jest.fn() },
}));
jest.mock('modules/data', () => ({
    getProjects: jest.requireActual(
        '../../../data/redux/selectors/baseSelectors'
    ).getProjects,
    useProjectDetail: jest.requireActual('../../../data/hooks/useProjectDetail')
        .useProjectDetail,
    submitData: jest.requireActual('../../../data/redux/actions').submitData,
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'de', t: (key) => key }),
}));
jest.mock('modules/routes', () => ({
    useProject: jest.requireActual('../../../routes/useProject').default,
    pathBase: () => '/pilot/de',
}));
jest.mock(
    'modules/auth/AuthShowContainer',
    () =>
        ({ hasProjectAccess, children }) =>
            hasProjectAccess ? children : null
);
jest.mock('modules/spinners', () => ({
    Spinner: () => <p role="status">Loading</p>,
}));
jest.mock('../../components', () => ({
    EditViewOrRedirect: ({ children }) => children,
    EditData: jest.fn(({ data, submitData }) => (
        <button
            onClick={() =>
                submitData(
                    { locale: 'de', project: { shortname: 'pilot' } },
                    {
                        access_config: {
                            id: data.id,
                            '[organization_setter]display': false,
                            '[job_description_setter][values]researcher': true,
                        },
                    },
                    { updateStateBeforeSubmit: true },
                    () => {}
                )
            }
        >
            Save
        </button>
    )),
}));

/**
 * Renders the page with real Redux request and mutation handling.
 *
 * @returns {Object} Rendered page controls.
 */
function renderPage() {
    const store = createStore(
        combineReducers({ data: dataReducer }),
        applyMiddleware(thunk)
    );
    return render(
        <Provider store={store}>
            <MemoryRouter
                initialEntries={['/pilot/de/project/edit-access-config']}
            >
                <EditProjectAccessPage />
            </MemoryRouter>
        </Provider>
    );
}

/**
 * Completes the pending detail read with boolean access settings or a missing configuration.
 *
 * @param {boolean|null} display - Organization display setting; null means no configuration.
 */
function complete(display) {
    const [, , dispatch, success] = Loader.getJson.mock.lastCall;
    dispatch(
        success({
            data: {
                id: 7,
                shortname: 'pilot',
                name: 'Project',
                access_config:
                    display === null
                        ? null
                        : {
                              id: 32,
                              organization: { display, obligatory: false },
                              job_description: {
                                  display: false,
                                  obligatory: false,
                                  values: { researcher: true },
                              },
                              research_intentions: {
                                  display: false,
                                  obligatory: false,
                                  values: {},
                              },
                              specification: {
                                  display: false,
                                  obligatory: false,
                              },
                              tos_agreement: {
                                  display: false,
                                  obligatory: false,
                              },
                          },
            },
        })
    );
}

beforeEach(() => jest.clearAllMocks());

test('loads editing settings and refetches after the existing save endpoint succeeds', () => {
    renderPage();
    expect(screen.getByRole('status')).toHaveTextContent('Loading');
    expect(EditData).not.toHaveBeenCalled();
    expect(Loader.getJson.mock.lastCall[0]).toBe(
        '/api/v2/projects/pilot?include=access_config&locale=de&profile=edit'
    );
    act(() => complete(true));
    expect(EditData.mock.lastCall[0]).toMatchObject({
        data: { id: 32 },
        initialFormValues: {
            '[organization_setter]display': true,
            '[organization_setter]obligatory': false,
            '[job_description_setter][values]researcher': true,
            '[job_description_setter][values]filmmaker': false,
        },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(Loader.getJson).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    const [url, params, dispatch, success] = Loader.put.mock.lastCall;
    expect(url).toBe('/pilot/de/access_configs/32');
    expect(params).toEqual({
        access_config: {
            organization_setter: { display: false },
            job_description_setter: { values: { researcher: true } },
        },
    });
    act(() =>
        dispatch(success({ data_type: 'projects', id: 7, data: { id: 7 } }))
    );
    expect(Loader.getJson).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('status')).toBeInTheDocument();
    act(() => complete(false));
    expect(
        EditData.mock.lastCall[0].initialFormValues[
            '[organization_setter]display'
        ]
    ).toBe(false);
});

test('denied reads show an error without using legacy settings or retrying', () => {
    renderPage();
    const [, , dispatch, , fail] = Loader.getJson.mock.lastCall;
    act(() => dispatch(fail({ status: 403, message: 'Access denied.' })));
    expect(screen.getByRole('alert')).toHaveTextContent('Access denied.');
    expect(screen.getByRole('alert')).toHaveClass('InlineNotification--error');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(EditData).not.toHaveBeenCalled();
    expect(Loader.getJson).toHaveBeenCalledTimes(1);
});

test('missing configuration stops loading without inventing editable settings', () => {
    renderPage();
    act(() => complete(null));
    expect(screen.getByRole('alert')).toHaveTextContent('error');
    expect(screen.getByRole('alert')).toHaveClass('InlineNotification--error');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(EditData).not.toHaveBeenCalled();
    expect(Loader.getJson).toHaveBeenCalledTimes(1);
});
