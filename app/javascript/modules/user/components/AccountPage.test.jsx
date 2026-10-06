import { fireEvent, render, screen } from '@testing-library/react';
import { useSelector } from 'react-redux';

import AccountPage from './AccountPage';

jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('modules/data', () => ({ getCurrentUser: jest.fn() }));
jest.mock('modules/analytics', () => ({ useTrackPageView: jest.fn() }));
jest.mock('modules/archive', () => ({ useIsEditor: () => false }));
jest.mock('modules/auth', () => ({
    AuthShowContainer: ({ children, ifLoggedOut }) =>
        ifLoggedOut ? null : children,
    AuthorizedContent: () => null,
}));
jest.mock('modules/features', () => ({ Features: () => null }));
jest.mock('modules/help-text', () => ({ HelpText: () => null }));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
jest.mock('modules/react-toolbox', () => ({
    ErrorBoundary: ({ children }) => children,
}));
jest.mock('modules/ui', () => ({
    Modal: ({ children }) => children(jest.fn()),
}));
jest.mock('./UserDetailsContainer', () => () => null);
jest.mock('./UserProjects', () => () => null);
jest.mock('./TwoFAPopup', () => () => null);
jest.mock('./PasskeyPopup', () => () => null);
jest.mock(
    './PendingEmailChange',
    () =>
        function MockPendingEmailChange() {
            return <div>Pending email notice</div>;
        }
);
jest.mock(
    './UserDetailsForm',
    () =>
        // eslint-disable-next-line react/prop-types
        function MockUserDetailsForm({ onEmailChange }) {
            return (
                <button onClick={onEmailChange}>
                    Simulate successful email change
                </button>
            );
        }
);
jest.mock(
    './AfterUpdateEmailPopup',
    () =>
        // eslint-disable-next-line react/prop-types
        function MockAfterUpdateEmailPopup({ onClose }) {
            return <button onClick={onClose}>Email changed popup</button>;
        }
);

describe('AccountPage email change feedback', () => {
    afterEach(() => jest.clearAllMocks());

    it('shows an existing pending change as a notice without reopening the popup', () => {
        useSelector.mockReturnValue({
            unconfirmed_email: 'pending@example.com',
        });
        render(<AccountPage />);
        expect(screen.getByText('Pending email notice')).toBeInTheDocument();
        expect(
            screen.queryByText('Email changed popup')
        ).not.toBeInTheDocument();
    });

    it('shows the popup after a successful email change and permits dismissal', () => {
        useSelector.mockReturnValue({
            unconfirmed_email: 'pending@example.com',
        });
        const { unmount } = render(<AccountPage />);
        fireEvent.click(screen.getByText('Simulate successful email change'));
        fireEvent.click(screen.getByText('Email changed popup'));
        expect(
            screen.queryByText('Email changed popup')
        ).not.toBeInTheDocument();
        unmount();
        render(<AccountPage />);
        expect(
            screen.queryByText('Email changed popup')
        ).not.toBeInTheDocument();
    });
});
