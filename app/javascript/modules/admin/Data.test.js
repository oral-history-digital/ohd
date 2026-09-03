import { fireEvent, render, screen } from '@testing-library/react';
import PropTypes from 'prop-types';

import Data from './Data';

jest.mock('modules/auth', () => {
    const MockPropTypes = jest.requireActual('prop-types');

    function AuthorizedContent({ children }) {
        return children;
    }

    AuthorizedContent.propTypes = { children: MockPropTypes.node };

    return { AuthorizedContent };
});
jest.mock('modules/data', () => ({
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
jest.mock('./DataDetails', () => {
    const MockPropTypes = jest.requireActual('prop-types');

    function DataDetails({ detailsAttributes, data }) {
        return (
            <div data-testid="data-details">
                {detailsAttributes.join(',')}:{data.id}
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
    deleteData: jest.fn(),
    registerDoi: jest.fn(),
};

function renderData(props = {}) {
    return render(<Data {...defaultProps} {...props} />);
}

beforeEach(() => {
    jest.clearAllMocks();
});

test('renders the record and its configured actions', () => {
    renderData();

    expect(screen.getAllByText('Test collection')).toHaveLength(2);
    expect(screen.getByTestId('action-show')).toBeInTheDocument();
    expect(screen.getByTestId('data-details')).toHaveTextContent('name,code:7');
    expect(screen.getByTestId('action-edit')).toBeInTheDocument();
    expect(screen.getByTestId('action-delete')).toBeInTheDocument();
    expect(screen.queryByTestId('action-register_doi')).not.toBeInTheDocument();
});

test('respects hidden action configuration', () => {
    renderData({ hideShow: true, hideEdit: true, hideDelete: true });

    expect(screen.queryByTestId('action-show')).not.toBeInTheDocument();
    expect(screen.queryByTestId('action-edit')).not.toBeInTheDocument();
    expect(screen.queryByTestId('action-delete')).not.toBeInTheDocument();
});

test('deletes the server record and removes it from Redux state', () => {
    renderData();

    fireEvent.click(screen.getByTestId('delete-item-confirm-button'));

    // The deleteData function is called twice: once to delete the record
    // from the server, and once to remove it from Redux state
    expect(defaultProps.deleteData.mock.calls).toEqual([
        [
            {
                locale: 'en',
                projectId: 'test',
                project: { id: 1, shortname: 'test' },
            },
            'collections',
            7,
            null,
            null,
            true,
        ],
        [
            {
                locale: 'en',
                projectId: 'test',
                project: { id: 1, shortname: 'test' },
            },
            'collections',
            7,
            null,
            null,
            null,
            true,
        ],
    ]);
});

test('uses a custom delete handler when provided', () => {
    const handleDelete = jest.fn();
    renderData({ handleDelete });

    fireEvent.click(screen.getByTestId('delete-item-confirm-button'));

    expect(handleDelete).toHaveBeenCalledWith(7, expect.any(Function));
    expect(defaultProps.deleteData).not.toHaveBeenCalled();
});

test('registers a DOI when that action is enabled', () => {
    renderData({ hideDelete: true, hideRegisterDoiAction: false });

    // DOI reuses the delete confirmation modal
    fireEvent.click(screen.getByTestId('delete-item-confirm-button'));

    expect(defaultProps.registerDoi).toHaveBeenCalledWith(
        '/test/en',
        'collections',
        7
    );
});

test('renders custom record and joined-data components', () => {
    function CustomRecord({ data }) {
        return <div>custom-{data.id}</div>;
    }
    CustomRecord.propTypes = { data: PropTypes.object.isRequired };

    renderData({
        showComponent: CustomRecord,
        joinedData: { interviews: jest.fn() },
    });

    expect(screen.getByText('custom-7')).toBeInTheDocument();
    expect(screen.getByTestId('joined-data')).toHaveTextContent('interviews');
});
