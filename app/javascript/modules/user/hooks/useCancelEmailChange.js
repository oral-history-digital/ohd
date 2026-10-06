import { receiveData } from 'modules/data';
import { usePathBase } from 'modules/routes';
import { useDispatch } from 'react-redux';
import { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';

async function cancelPendingEmailChange(url) {
    const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'X-CSRF-Token':
                document.querySelector('meta[name="csrf-token"]')?.content ||
                '',
        },
    });
    if (!response.ok) throw new Error('Email change cancellation failed');
    return response.json();
}

export function useCancelEmailChange() {
    const pathBase = usePathBase();
    const dispatch = useDispatch();
    const { mutate } = useSWRConfig();
    const { trigger, isMutating, error } = useSWRMutation(
        `${pathBase}/users/current/cancel_email_change.json`,
        cancelPendingEmailChange,
        {
            throwOnError: false,
            onSuccess(payload) {
                // Keep the Redux-backed account view synchronized during the SWR migration.
                dispatch(receiveData(payload));
                mutate(`${pathBase}/users/current.json`, payload, {
                    revalidate: false,
                });
            },
        }
    );

    return { cancelEmailChange: trigger, isCancelling: isMutating, error };
}

export default useCancelEmailChange;
