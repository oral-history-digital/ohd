/* eslint-disable react/prop-types */
import { act, render, screen } from '@testing-library/react';
import Loader from 'modules/api/Loader';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

import { dataReducer } from '../../../data/redux/reducer';
import { PaginatedAdminRecordList } from '../../components';
import MetadataFieldShow from './MetadataFieldShow';
import MetadataFieldsAdminPage from './MetadataFieldsAdminPage';

jest.mock('modules/api/Loader', () => ({
    __esModule: true,
    default: {
        getJson: jest.fn(),
        put: jest.fn(),
        post: jest.fn(),
        delete: jest.fn(),
    },
}));
jest.mock('modules/data', () => ({
    getProjects: jest.requireActual(
        '../../../data/redux/selectors/baseSelectors'
    ).getProjects,
    useProjectDetail: jest.requireActual('../../../data/hooks/useProjectDetail')
        .useProjectDetail,
    ...jest.requireActual('../../../data/redux/actions'),
}));
jest.mock('modules/routes', () => ({
    useProject: jest.requireActual('../../../routes/useProject').default,
    pathBase: () => '/pilot/de',
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'de', t: (key) => key }),
}));
jest.mock('modules/archive', () => ({
    getTranslations: () => ({ 'search_facets.gender': 'Geschlecht' }),
}));
jest.mock('modules/search', () => ({ setQueryParams: jest.fn() }));
jest.mock('../../hooks', () => ({
    useAdminDataActions: jest.requireActual('../../hooks/useAdminDataActions')
        .default,
}));
jest.mock('./MetadataFieldForm', () => () => null);
jest.mock('modules/spinners', () => ({
    Spinner: () => <p role="status">Loading</p>,
}));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));
jest.mock('../../components', () => ({
    PaginatedAdminRecordList: jest.fn(({ data, showComponent: Show }) =>
        data.map((field) => <Show key={field.id} data={field} />)
    ),
}));

const field = {
    id: 12,
    name: 'custom_field',
    source: 'Interview',
    label: 'Bezeichnung',
    use_in_metadata_import: false,
    translations: [{ id: 41, locale: 'de', label: '' }],
};

/**
 * Renders metadata administration with the real Redux read and mutation flow.
 * @returns {Object} Render controls.
 */
function renderPage() {
    const store = createStore(
        combineReducers({ data: dataReducer }),
        applyMiddleware(thunk)
    );
    return render(
        <Provider store={store}>
            <MemoryRouter initialEntries={['/pilot/de/admin/metadata_fields']}>
                <MetadataFieldsAdminPage />
            </MemoryRouter>
        </Provider>
    );
}

/**
 * Completes the latest detail request with editable field definitions.
 * @param {Array<Object>} fields - Server metadata records.
 */
function complete(fields = [field]) {
    const [, , dispatch, success] = Loader.getJson.mock.lastCall;
    dispatch(
        success({
            data: { id: 7, shortname: 'pilot', metadata_fields: fields },
        })
    );
}

beforeEach(() => jest.clearAllMocks());

test('waits for edit details and preserves stored translation IDs and blank labels', () => {
    renderPage();
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(PaginatedAdminRecordList).not.toHaveBeenCalled();
    expect(Loader.getJson.mock.lastCall[0]).toBe(
        '/api/v2/projects/pilot?include=metadata_fields&locale=de&profile=edit'
    );
    act(() => complete());
    expect(screen.getByText('Bezeichnung')).toBeInTheDocument();
    expect(PaginatedAdminRecordList.mock.lastCall[0]).toMatchObject({
        data: [field],
        outerScope: 'project',
        outerScopeId: 7,
    });
});

test('denied details hide the editor without falling back to legacy fields', () => {
    renderPage();
    const [, , dispatch, , fail] = Loader.getJson.mock.lastCall;
    act(() => dispatch(fail({ status: 403, message: 'Access denied.' })));
    expect(screen.getByRole('alert')).toHaveTextContent('Access denied.');
    expect(PaginatedAdminRecordList).not.toHaveBeenCalled();
    expect(Loader.getJson).toHaveBeenCalledTimes(1);
});

test('a successful save refreshes metadata details through the existing mutation flow', () => {
    renderPage();
    act(() => complete());
    act(() =>
        PaginatedAdminRecordList.mock.lastCall[0].submitData(
            { pathBase: '/pilot/de' },
            {
                metadata_field: {
                    id: 12,
                    translations_attributes: [
                        { id: 41, locale: 'de', label: 'Neu' },
                    ],
                },
            }
        )
    );
    expect(Loader.put.mock.lastCall[0]).toBe('/pilot/de/metadata_fields/12');
    expect(Loader.getJson).toHaveBeenCalledTimes(1);
    const [, , dispatch, success] = Loader.put.mock.lastCall;
    act(() =>
        dispatch(
            success({ data_type: 'metadata_fields', id: 12, data: { id: 12 } })
        )
    );
    expect(Loader.getJson).toHaveBeenCalledTimes(2);
    act(() => complete([{ ...field, label: 'Neu' }]));
    expect(screen.getByText('Neu')).toBeInTheDocument();
    expect(screen.queryByText('Bezeichnung')).not.toBeInTheDocument();
});

test('a successful deletion refreshes the included definitions', () => {
    renderPage();
    act(() => complete());
    act(() =>
        PaginatedAdminRecordList.mock.lastCall[0].deleteData(
            { pathBase: '/pilot/de' },
            'metadata_fields',
            12,
            null,
            null,
            true
        )
    );
    expect(Loader.delete.mock.lastCall[0]).toBe('/pilot/de/metadata_fields/12');
    const [, dispatch, success] = Loader.delete.mock.lastCall;
    act(() =>
        dispatch(success({ data_type: 'metadata_fields', id: 12, data: {} }))
    );
    expect(Loader.getJson).toHaveBeenCalledTimes(2);
    act(() => complete([]));
    expect(screen.queryByText('Bezeichnung')).not.toBeInTheDocument();
});

test.each([
    [{ name: 'custom', label: { de: 'Alte Bezeichnung' } }, 'Alte Bezeichnung'],
    [{ name: 'gender', label: 'Ignored' }, 'search_facets.gender'],
])(
    'field labels preserve legacy locale maps and built-in facet names (%p)',
    (data, text) => {
        render(
            <Provider store={createStore((state = {}) => state)}>
                <MetadataFieldShow data={data} />
            </Provider>
        );
        expect(screen.getByText(text)).toBeInTheDocument();
    }
);
