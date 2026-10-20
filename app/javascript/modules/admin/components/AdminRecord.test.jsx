import { fireEvent, render, screen } from '@testing-library/react';
import { registerDoi } from 'modules/archive';
import { deleteData, useGetProject } from 'modules/data';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import AdminRecord from './AdminRecord';

jest.mock('modules/archive', () => ({
    getProjectId: (state) => state.archive?.projectId,
    registerDoi: jest.fn((...args) => ({ type: 'registerDoi', args })),
}));

jest.mock('modules/auth', () => {
    const MockPropTypes = jest.requireActual('prop-types');

    function AuthorizedContent({ children }) {
        return children;
    }

    AuthorizedContent.propTypes = { children: MockPropTypes.node };

    return { AuthorizedContent };
});
jest.mock('modules/data', () => ({
    deleteData: jest.fn((...args) => ({ type: 'deleteData', args })),
    useGetProject: jest.fn(),
    useSensitiveData: jest.fn(),
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key, locale: 'en' }),
}));
jest.mock('modules/person', () => {
    const MockPropTypes = jest.requireActual('prop-types');

    function PersonDetails({ data }) {
        return <div>person-{data.id}</div>;
    }

    PersonDetails.propTypes = { data: MockPropTypes.object.isRequired };

    return { PersonDetails };
});
jest.mock('modules/routes', () => ({
    usePathBase: () => '/test/en',
    useProject: () => ({
        project: { id: 1, shortname: 'test' },
        projectId: 'test',
    }),
}));
jest.mock('modules/spinners', () => ({
    Spinner: () => <div>loading</div>,
}));
jest.mock('modules/ui', () => {
    const MockPropTypes = jest.requireActual('prop-types');

    function AdminMenu({ children, disabled }) {
        return <div data-disabled={disabled}>{children}</div>;
    }

    AdminMenu.propTypes = {
        children: MockPropTypes.node,
        disabled: MockPropTypes.bool,
    };

    function AdminMenuItem({ name, children }) {
        return (
            <div data-testid={`action-${name}`}>
                {typeof children === 'function'
                    ? children(jest.fn())
                    : children}
            </div>
        );
    }

    AdminMenuItem.propTypes = {
        name: MockPropTypes.string.isRequired,
        children: MockPropTypes.oneOfType([
            MockPropTypes.node,
            MockPropTypes.func,
        ]),
    };
    AdminMenu.Item = AdminMenuItem;

    return { AdminMenu };
});
jest.mock('react-redux', () => ({
    connect: () => (Component) => Component,
    useDispatch: jest.fn(),
}));
jest.mock('./DataDetails', () => {
    const MockPropTypes = jest.requireActual('prop-types');

    function DataDetails({ detailsAttributes, data }) {
        return (
            <div data-testid="data-details">
                {detailsAttributes.join(',')}:{data.id}:{data.title}:
                {data.doi_status}
            </div>
        );
    }

    DataDetails.propTypes = {
        detailsAttributes: MockPropTypes.array.isRequired,
        data: MockPropTypes.object.isRequired,
    };

    return DataDetails;
});
jest.mock('./JoinedData', () => {
    const MockPropTypes = jest.requireActual('prop-types');

    function JoinedData({ joinedData }) {
        return (
            <div data-testid="joined-data">
                {Object.keys(joinedData).join(',')}
            </div>
        );
    }

    JoinedData.propTypes = { joinedData: MockPropTypes.object.isRequired };

    return JoinedData;
});

const defaultProps = {
    data: {
        id: 7,
        type: 'Collection',
        name: { en: 'Test collection' },
    },
    detailsAttributes: ['name', 'code'],
    form: jest.fn(() => null),
    scope: 'collection',
};

const dispatch = jest.fn();

function renderAdminRecord(props = {}) {
    return render(<AdminRecord {...defaultProps} {...props} />);
}

beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(dispatch);
});

test('renders the record and its configured actions', () => {
    renderAdminRecord();

    expect(screen.getAllByText('Test collection')).toHaveLength(2);
    expect(screen.getByTestId('action-show')).toBeInTheDocument();
    expect(screen.getByTestId('action-edit')).toBeInTheDocument();
    expect(screen.getByTestId('action-delete')).toBeInTheDocument();
    expect(screen.queryByTestId('action-register_doi')).not.toBeInTheDocument();
});

test('respects hidden action configuration', () => {
    renderAdminRecord({ hideShow: true, hideEdit: true, hideDelete: true });

    expect(screen.queryByTestId('action-show')).not.toBeInTheDocument();
    expect(screen.queryByTestId('action-edit')).not.toBeInTheDocument();
    expect(screen.queryByTestId('action-delete')).not.toBeInTheDocument();
});

test('deletes the server record and removes it from Redux state', () => {
    renderAdminRecord();

    fireEvent.click(screen.getByRole('button', { name: 'delete' }));

    expect(deleteData.mock.calls).toEqual([
        [{ pathBase: '/test/en' }, 'collections', 7, null, null, true],
        [{ pathBase: '/test/en' }, 'collections', 7, null, null, null, true],
    ]);
    expect(dispatch).toHaveBeenCalledTimes(2);
});

test('uses a custom delete handler when provided', () => {
    const handleDelete = jest.fn();
    renderAdminRecord({ handleDelete });

    fireEvent.click(screen.getByRole('button', { name: 'delete' }));

    expect(handleDelete).toHaveBeenCalledWith(7, expect.any(Function));
    expect(deleteData).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
});

test('registers a DOI when that action is enabled', () => {
    renderAdminRecord({ hideDelete: true, hideRegisterDoiAction: false });

    fireEvent.click(screen.getByRole('button', { name: 'register_doi' }));

    expect(registerDoi).toHaveBeenCalledWith('/test/en', 'collections', 7);
    expect(dispatch).toHaveBeenCalledWith({
        type: 'registerDoi',
        args: ['/test/en', 'collections', 7],
    });
});

test('renders custom record and joined-data components', () => {
    function CustomRecord({ data }) {
        return <div>custom-{data.id}</div>;
    }
    CustomRecord.propTypes = { data: PropTypes.object.isRequired };

    renderAdminRecord({
        showComponent: CustomRecord,
        joinedData: { interviews: jest.fn() },
    });

    expect(screen.getByText('custom-7')).toBeInTheDocument();
    expect(screen.getByTestId('joined-data')).toHaveTextContent('interviews');
});

test('project editing waits for details instead of opening a form with summary data', () => {
    useGetProject.mockReturnValue({
        project: undefined,
        loading: true,
        error: null,
    });
    const form = jest.fn();
    renderAdminRecord({
        scope: 'project',
        hideShow: true,
        data: { id: 7, type: 'Project', name: 'Archive' },
        form,
    });
    expect(screen.getByText('loading')).toBeInTheDocument();
    expect(form).not.toHaveBeenCalled();
});

test('project editing shows a loading error without falling back to summary data', () => {
    useGetProject.mockReturnValue({
        project: undefined,
        loading: false,
        error: { status: 403, message: 'Forbidden' },
    });
    const form = jest.fn();
    renderAdminRecord({
        scope: 'project',
        hideShow: true,
        data: { id: 7, type: 'Project', name: 'Archive' },
        form,
    });
    expect(screen.getByRole('alert')).toHaveTextContent('Forbidden');
    expect(form).not.toHaveBeenCalled();
});

test('project editing uses loaded translations and refreshes details after submission', () => {
    const project = {
        id: 7,
        type: 'Project',
        name: { en: 'Archive' },
        translations_attributes: [{ locale: 'en', name: 'Archive' }],
    };
    const mutate = jest.fn();
    useGetProject.mockReturnValue({
        project,
        loading: false,
        error: null,
        mutate,
    });
    const form = jest.fn();
    renderAdminRecord({
        scope: 'project',
        data: { id: 7, type: 'Project', name: 'Summary' },
        form,
    });
    expect(form).toHaveBeenCalledWith(
        project,
        expect.any(Function),
        expect.any(Function)
    );
    form.mock.calls[0][1]();
    expect(mutate).toHaveBeenCalledTimes(1);
});

test('project details load title and DOI status rather than relying on list fields', () => {
    useGetProject.mockReturnValue({
        project: { id: 7, title: 'project-shortname', doi_status: 'created' },
    });
    renderAdminRecord({
        scope: 'project',
        data: { id: 7, type: 'Project', name: 'Summary' },
        detailsAttributes: ['title', 'doi_status'],
        hideEdit: true,
    });
    expect(useGetProject).toHaveBeenCalledWith({ id: 7 });
    expect(screen.getByTestId('data-details')).toHaveTextContent(
        'project-shortname:created'
    );
});
