import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { receiveData } from 'modules/data';
import { useDispatch, useSelector } from 'react-redux';
import { SWRConfig } from 'swr';

import PendingEmailChange from './PendingEmailChange';

function SwrWrapper(props) {
    return <SWRConfig {...props} value={{ provider: () => new Map() }} />;
}

jest.mock('modules/data', () => ({
    getCurrentUser: jest.fn(),
    receiveData: jest.fn((payload) => ({ type: 'RECEIVE_DATA', payload })),
}));
jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));
jest.mock('modules/routes', () => ({ usePathBase: () => '/archive/es' }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key, values) => values?.email || key }),
}));

describe('PendingEmailChange', () => {
    const originalFetch = window.fetch;
    let dispatch;

    beforeEach(() => {
        dispatch = jest.fn();
        useDispatch.mockReturnValue(dispatch);
        useSelector.mockReturnValue({
            unconfirmed_email: 'pending@example.com',
        });
        window.fetch = jest.fn();
    });

    afterEach(() => {
        window.fetch = originalFetch;
        jest.clearAllMocks();
    });

    it('shows the pending address and cancels through the current project route', async () => {
        const payload = {
            id: 'current',
            data_type: 'users',
            data: { unconfirmed_email: null },
        };
        window.fetch.mockResolvedValue({ ok: true, json: async () => payload });
        const { rerender } = render(<PendingEmailChange />, {
            wrapper: SwrWrapper,
        });
        expect(screen.getByText('pending@example.com')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('button')).toBeDisabled();
        await waitFor(() => expect(dispatch).toHaveBeenCalled());
        expect(window.fetch).toHaveBeenCalledWith(
            '/archive/es/users/current/cancel_email_change.json',
            expect.objectContaining({
                method: 'DELETE',
                credentials: 'same-origin',
            })
        );
        expect(receiveData).toHaveBeenCalledWith(payload);
        useSelector.mockReturnValue(payload.data);
        rerender(<PendingEmailChange />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('keeps the notice and permits retry if cancellation fails', async () => {
        window.fetch.mockResolvedValue({ ok: false });
        render(<PendingEmailChange />, { wrapper: SwrWrapper });
        fireEvent.click(screen.getByRole('button'));
        expect(await screen.findByRole('alert')).toHaveTextContent(
            'user.pending_email_change.error'
        );
        expect(screen.getByRole('button')).not.toBeDisabled();
        expect(dispatch).not.toHaveBeenCalled();
    });

    it('shows nothing when there is no pending change', () => {
        useSelector.mockReturnValue({ unconfirmed_email: null });
        const { container } = render(<PendingEmailChange />, {
            wrapper: SwrWrapper,
        });
        expect(container).toBeEmptyDOMElement();
    });
});
