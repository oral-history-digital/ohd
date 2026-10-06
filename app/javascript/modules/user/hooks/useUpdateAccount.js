import { receiveData } from 'modules/data';
import { usePathBase } from 'modules/routes';
import { useDispatch } from 'react-redux';
import { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';

async function updateAccount(url, { arg: params }) {
    const attributes = { ...params.user };
    delete attributes.id;
    const response = await fetch(url, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-Token':
                document.querySelector('meta[name="csrf-token"]')?.content ||
                '',
        },
        body: JSON.stringify({ user: attributes }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || response.statusText);
    return payload;
}

export function useUpdateAccount() {
    const pathBase = usePathBase();
    const dispatch = useDispatch();
    const { mutate } = useSWRConfig();
    const { trigger, isMutating, error } = useSWRMutation(
        `${pathBase}/users/current.json`,
        updateAccount,
        {
            onSuccess(payload) {
                dispatch(receiveData(payload));
                mutate(`${pathBase}/users/current.json`, payload, {
                    revalidate: false,
                });
            },
        }
    );
    return { updateAccount: trigger, isSaving: isMutating, error };
}
