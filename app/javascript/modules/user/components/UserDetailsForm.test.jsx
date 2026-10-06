import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { receiveData } from 'modules/data';
import { useDispatch, useSelector } from 'react-redux';
import { SWRConfig } from 'swr';

import UserDetailsForm from './UserDetailsForm';

jest.mock('modules/data', () => ({
    receiveData: jest.fn((payload) => ({ type: 'RECEIVE_DATA', payload })),
    getCurrentUser: jest.fn(),
}));
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));
jest.mock('modules/routes', () => ({ usePathBase: () => '/archive/es' }));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));

let accountCache;

function SwrWrapper(props) {
    return <SWRConfig {...props} value={{ provider: () => accountCache }} />;
}

describe('UserDetailsForm email changes', () => {
    const originalFetch = window.fetch;
    let props;
    let user;
    let dispatch;

    beforeEach(() => {
        user = { id: 1, email: 'old@example.com', unconfirmed_email: null };
        props = {
            onSubmit: jest.fn(),
            onCancel: jest.fn(),
            onEmailChange: jest.fn(),
        };
        dispatch = jest.fn();
        accountCache = new Map();
        accountCache.set('/archive/es/users/current.json', {
            data: { id: 'current', data_type: 'users', data: user },
        });
        useDispatch.mockReturnValue(dispatch);
        useSelector.mockImplementation(() => user);
        window.fetch = jest.fn();
    });

    afterEach(() => {
        window.fetch = originalFetch;
        jest.clearAllMocks();
    });

    function submit(email = 'new@example.com') {
        render(<UserDetailsForm {...props} />, { wrapper: SwrWrapper });
        fireEvent.change(
            screen.getByLabelText(/activerecord.attributes.user.email/),
            { target: { value: email } }
        );
        fireEvent.click(screen.getByRole('button', { name: 'submit' }));
    }

    it('shows the email popup and closes only after a successful save', async () => {
        const payload = {
            id: 'current',
            data_type: 'users',
            data: { unconfirmed_email: 'new@example.com' },
        };
        window.fetch.mockResolvedValue({ ok: true, json: async () => payload });
        submit();
        expect(props.onEmailChange).not.toHaveBeenCalled();
        expect(props.onSubmit).not.toHaveBeenCalled();
        await waitFor(() => expect(props.onSubmit).toHaveBeenCalledTimes(1));
        expect(props.onEmailChange).toHaveBeenCalledTimes(1);
        expect(receiveData).toHaveBeenCalledWith(payload);
        expect(accountCache.get('/archive/es/users/current.json').data).toEqual(
            payload
        );
        expect(window.fetch).toHaveBeenCalledWith(
            '/archive/es/users/current.json',
            expect.objectContaining({ method: 'PUT' })
        );
        expect(JSON.parse(window.fetch.mock.calls[0][1].body).user.email).toBe(
            'new@example.com'
        );
    });

    it('keeps the form open with a validation notification and allows correction', async () => {
        window.fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({
                error: 'This email address cannot be used. Please enter a different email address.',
                errors: {
                    email: [
                        'This email address cannot be used. Please enter a different email address.',
                    ],
                },
            }),
        });
        submit('taken@example.com');
        expect(await screen.findByRole('alert')).toHaveTextContent(
            'This email address cannot be used. Please enter a different email address.'
        );
        expect(
            screen.getByLabelText(/activerecord.attributes.user.email/)
        ).toHaveValue('taken@example.com');
        expect(props.onSubmit).not.toHaveBeenCalled();
        expect(props.onEmailChange).not.toHaveBeenCalled();
        expect(dispatch).not.toHaveBeenCalled();
        expect(
            accountCache.get('/archive/es/users/current.json').data.data
        ).toEqual(user);
        expect(
            screen.getByRole('button', { name: 'submit' })
        ).not.toBeDisabled();

        window.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                id: 'current',
                data_type: 'users',
                data: { unconfirmed_email: 'corrected@example.com' },
            }),
        });
        fireEvent.change(
            screen.getByLabelText(/activerecord.attributes.user.email/),
            { target: { value: 'corrected@example.com' } }
        );
        fireEvent.click(screen.getByRole('button', { name: 'submit' }));
        await waitFor(() => expect(props.onSubmit).toHaveBeenCalledTimes(1));
        await waitFor(() =>
            expect(screen.queryByRole('alert')).not.toBeInTheDocument()
        );
    });

    it('does not show the popup for an unchanged pending address', async () => {
        user.unconfirmed_email = 'new@example.com';
        window.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                data: { unconfirmed_email: 'new@example.com' },
            }),
        });
        submit();
        await waitFor(() => expect(props.onSubmit).toHaveBeenCalled());
        expect(props.onEmailChange).not.toHaveBeenCalled();
    });

    it('does not show the popup for a save without a pending change', async () => {
        window.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ data: { unconfirmed_email: null } }),
        });
        submit();
        await waitFor(() => expect(props.onSubmit).toHaveBeenCalled());
        expect(props.onEmailChange).not.toHaveBeenCalled();
    });
});
