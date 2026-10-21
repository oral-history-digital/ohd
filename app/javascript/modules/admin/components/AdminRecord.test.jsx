import { fireEvent, render, screen } from '@testing-library/react';
import { registerDoi } from 'modules/archive';
import { AuthorizedContent } from 'modules/auth';
import { deleteData, useProjectDetail } from 'modules/data';
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

    return { AuthorizedContent: jest.fn(AuthorizedContent) };
});
jest.mock('modules/data', () => ({
    deleteData: jest.fn((...args) => ({ type: 'deleteData', args })),
    useProjectDetail: jest.fn(),
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

    function InlineNotification({ description }) {
        return <p role="alert">{description}</p>;
    }
    InlineNotification.propTypes = { description: MockPropTypes.string };
    return { AdminMenu, InlineNotification };
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
                {detailsAttributes.join(',')}:{data.id}:
                {data.shortname || data.title}:{data.doi_status}
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
    useProjectDetail.mockReturnValue({
        project: undefined,
        isLoading: true,
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
    useProjectDetail.mockReturnValue({
        project: { id: 7, available_locales: ['en'] },
        isLoading: false,
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

test('project editing retains stored translations and adapts locales without manually refetching', () => {
    const project = {
        id: 7,
        type: 'Project',
        shortname: 'archive',
        name: 'Archive',
        available_locales: ['de', 'en'],
        translations: [{ id: 12, locale: 'en', name: '' }],
    };
    const mutate = jest.fn();
    useProjectDetail.mockReturnValue({
        project,
        isLoading: false,
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
        { ...project, pseudo_available_locales: 'de,en' },
        expect.any(Function),
        expect.any(Function)
    );
    form.mock.calls[0][1]();
    expect(mutate).not.toHaveBeenCalled();
    expect(project).not.toHaveProperty('pseudo_available_locales');
});

test('project dialogs load by shortname and display the API identifier and DOI status', () => {
    useProjectDetail.mockReturnValue({
        project: {
            id: 7,
            shortname: 'project-shortname',
            available_locales: ['en'],
            doi_status: 'created',
        },
    });
    renderAdminRecord({
        scope: 'project',
        data: {
            id: 7,
            type: 'Project',
            shortname: 'project-shortname',
            name: 'Summary',
        },
        detailsAttributes: ['shortname', 'doi_status'],
        hideEdit: true,
    });
    expect(useProjectDetail).toHaveBeenCalledWith('project-shortname', {
        profile: 'edit',
        include: ['translations'],
    });
    expect(screen.getByTestId('data-details')).toHaveTextContent(
        'project-shortname:created'
    );
});

test('uses the resource scope for permission checks when API records omit a class name', () => {
    renderAdminRecord({
        scope: 'external_link',
        data: { id: 7, name: 'Link' },
    });
    expect(AuthorizedContent.mock.lastCall[0].object[0]).toEqual({
        id: 7,
        name: 'Link',
        type: 'ExternalLink',
    });
});
