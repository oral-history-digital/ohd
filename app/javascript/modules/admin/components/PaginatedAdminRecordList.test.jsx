import { fireEvent, render, screen } from '@testing-library/react';

import DataList from './DataList';
import PaginatedAdminRecordList from './PaginatedAdminRecordList';

jest.mock('modules/auth', () => {
    const MockPropTypes = jest.requireActual('prop-types');

    function AuthShowContainer({ children }) {
        return children;
    }

    AuthShowContainer.propTypes = { children: MockPropTypes.node };

    return { AuthShowContainer };
});
jest.mock('modules/react-toolbox', () => ({
    ErrorBoundary: jest.requireActual('react').Fragment,
}));
jest.mock('modules/ui', () => ({ Modal: () => null }));
jest.mock('modules/forms', () => {
    const MockPropTypes = jest.requireActual('prop-types');

    function Form({ onSubmit }) {
        return (
            <button type="button" onClick={() => onSubmit({ role: {} })}>
                submit-form
            </button>
        );
    }

    Form.propTypes = { onSubmit: MockPropTypes.func.isRequired };

    return { Form };
});
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key, locale: 'en' }),
}));
jest.mock('modules/routes', () => ({
    usePathBase: () => '/test/en',
    useProjectIdentity: () => ({ projectDbId: 1 }),
}));
jest.mock('react-helmet', () => ({
    Helmet: ({ children }) => children,
}));
jest.mock('./AddButton', () => {
    const React = jest.requireActual('react');
    const MockPropTypes = jest.requireActual('prop-types');

    function AddButton({ onClose, scope }) {
        const [isOpen, setIsOpen] = React.useState(false);

        return (
            <div>
                <button type="button" onClick={() => setIsOpen(true)}>
                    add-{scope}
                </button>
                {isOpen && onClose(() => setIsOpen(false))}
            </div>
        );
    }

    AddButton.propTypes = {
        onClose: MockPropTypes.func.isRequired,
        scope: MockPropTypes.string.isRequired,
    };

    return AddButton;
});
jest.mock('./AdminRecord', () => {
    const MockPropTypes = jest.requireActual('prop-types');

    function AdminRecord({ data }) {
        return <div data-testid="admin-record">{data.name.en}</div>;
    }

    AdminRecord.propTypes = { data: MockPropTypes.object.isRequired };

    return AdminRecord;
});
jest.mock('./EditViewOrRedirect', () => {
    const MockPropTypes = jest.requireActual('prop-types');

    function EditViewOrRedirect({ children }) {
        return children;
    }

    EditViewOrRedirect.propTypes = { children: MockPropTypes.node };

    return EditViewOrRedirect;
});
jest.mock('../hooks', () => ({
    usePaginatedAdminRecords: () => ({
        hasMorePages: false,
        isFetching: false,
        loadNextPage: jest.fn(),
        shouldShowPagination: false,
    }),
}));

const defaultProps = {
    data: {
        1: { id: 1, name: { en: 'First' }, position: 2 },
        2: { id: 2, name: { en: 'Second' }, position: 1 },
    },
    dataStatus: { all: 'fetched' },
    formElements: [],
    query: { name: 'history', page: 1 },
    scope: 'role',
    fetchData: jest.fn(),
    setQueryParams: jest.fn(),
    submitData: jest.fn(),
};

function renderPaginatedAdminRecordList(props = {}) {
    return render(<PaginatedAdminRecordList {...defaultProps} {...props} />);
}

beforeEach(() => {
    jest.clearAllMocks();
});

test('renders records in the configured order', () => {
    renderPaginatedAdminRecordList({ sortAttribute: 'position' });

    expect(
        screen
            .getAllByTestId('admin-record')
            .map((element) => element.textContent)
    ).toEqual(['Second', 'First']);
});

test('submits the default add form and closes it', () => {
    renderPaginatedAdminRecordList();

    fireEvent.click(screen.getAllByRole('button', { name: 'add-role' })[0]);
    fireEvent.click(screen.getByRole('button', { name: 'submit-form' }));

    expect(defaultProps.submitData).toHaveBeenCalledWith(
        { pathBase: '/test/en' },
        { role: {} }
    );
    expect(
        screen.queryByRole('button', { name: 'submit-form' })
    ).not.toBeInTheDocument();
});

test('hides both add controls when creation is disabled', () => {
    renderPaginatedAdminRecordList({ hideAdd: true });

    expect(
        screen.queryByRole('button', { name: 'add-role' })
    ).not.toBeInTheDocument();
});

test('shared record lists load supporting resources once through the current route', () => {
    const fetchData = jest.fn();
    const { rerender } = render(
        <DataList
            data={{}}
            scope="role"
            hideAdd
            fetchData={fetchData}
            submitData={jest.fn()}
            otherDataToLoad={['language']}
        />
    );
    expect(fetchData).toHaveBeenCalledWith(
        { pathBase: '/test/en' },
        'languages',
        null,
        null,
        'all'
    );
    rerender(
        <DataList
            data={{}}
            scope="role"
            hideAdd
            fetchData={fetchData}
            submitData={jest.fn()}
            otherDataToLoad={['language']}
        />
    );
    expect(fetchData).toHaveBeenCalledTimes(1);
});
