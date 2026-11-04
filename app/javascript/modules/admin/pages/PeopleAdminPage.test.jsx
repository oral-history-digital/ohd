/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { useEventTypes } from 'modules/event-types';
import { usePeople } from 'modules/person';

import PeopleAdminPage from './PeopleAdminPage';

const mockDispatch = jest.fn();
let mockIsEditor;
let mockHasAccess;
jest.mock('react-redux', () => ({ useDispatch: () => mockDispatch }));
jest.mock('modules/auth', () => ({
    AuthShowContainer: ({ children, hasProjectAccess }) =>
        (hasProjectAccess ? mockHasAccess : !mockHasAccess) ? children : null,
}));
jest.mock('modules/event-types', () => ({ useEventTypes: jest.fn() }));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
jest.mock('modules/person', () => ({
    usePeople: jest.fn(),
    PersonForm: () => null,
    PersonTable: () => <p>People table</p>,
}));
jest.mock('modules/sidebar', () => ({
    hideSidebar: () => ({ type: 'hide sidebar' }),
}));
jest.mock('modules/spinners', () => ({ Spinner: () => <p>Loading people</p> }));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));
jest.mock('react-helmet', () => ({ Helmet: () => null }));
jest.mock('../components', () => ({
    AddButton: () => <button>Add person</button>,
    EditViewOrRedirect: ({ children }) => (mockIsEditor ? children : null),
}));

beforeEach(() => {
    jest.clearAllMocks();
    mockIsEditor = true;
    mockHasAccess = true;
    usePeople.mockReturnValue({ isLoading: true });
    useEventTypes.mockReturnValue({ isLoading: true });
});

test('shows loading while project, people, or event types load, then displays the table', () => {
    const { rerender } = render(<PeopleAdminPage />);
    expect(screen.getByText('Loading people')).toBeInTheDocument();
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'hide sidebar' });
    usePeople.mockReturnValue({ data: { 5: { id: 5 } }, isLoading: false });
    rerender(<PeopleAdminPage />);
    expect(screen.getByText('Loading people')).toBeInTheDocument();
    expect(screen.queryByText('People table')).not.toBeInTheDocument();
    useEventTypes.mockReturnValue({ data: [], isLoading: false });
    rerender(<PeopleAdminPage />);
    expect(screen.getByRole('heading')).toHaveTextContent(
        '1 activerecord.models.person.other'
    );
    expect(screen.getByText('People table')).toBeInTheDocument();
    expect(screen.queryByText('Loading people')).not.toBeInTheDocument();
});

test.each([usePeople, useEventTypes])(
    'shows %p errors instead of a blank page or an endless spinner',
    (hook) => {
        hook.mockReturnValue({ error: { message: 'Request failed' } });
        render(<PeopleAdminPage />);
        expect(screen.getByRole('alert')).toHaveTextContent('Request failed');
        expect(screen.queryByText('Loading people')).not.toBeInTheDocument();
        expect(screen.queryByText('People table')).not.toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    }
);

test('allows adding the first person after an empty list loads', () => {
    usePeople.mockReturnValue({ data: {} });
    useEventTypes.mockReturnValue({ data: [] });
    render(<PeopleAdminPage />);
    expect(screen.getByRole('heading')).toHaveTextContent(
        '0 activerecord.models.person.other'
    );
    expect(
        screen.getByRole('button', { name: 'Add person' })
    ).toBeInTheDocument();
});

test('keeps loading and administration controls inside the existing access and edit-view checks', () => {
    mockHasAccess = false;
    const { rerender } = render(<PeopleAdminPage />);
    expect(
        screen.getByText('devise.failure.unauthenticated')
    ).toBeInTheDocument();
    expect(screen.queryByText('Loading people')).not.toBeInTheDocument();
    mockIsEditor = false;
    rerender(<PeopleAdminPage />);
    expect(
        screen.queryByText('devise.failure.unauthenticated')
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
});
