import { useState } from 'react';

import { getCurrentUser, receiveData } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { Button } from 'modules/ui/Buttons';
import InlineNotification from 'modules/ui/InlineNotification';
import { useDispatch, useSelector } from 'react-redux';

export default function PendingEmailChange() {
    const user = useSelector(getCurrentUser);
    const dispatch = useDispatch();
    const { t } = useI18n();
    const pathBase = usePathBase();
    const [isCancelling, setIsCancelling] = useState(false);
    const [failed, setFailed] = useState(false);

    if (!user?.unconfirmed_email) return null;

    const notice = t('user.pending_email_change.notice', {
        email: user.unconfirmed_email,
    });

    async function cancelEmailChange() {
        setIsCancelling(true);
        setFailed(false);
        try {
            const response = await fetch(
                `${pathBase}/users/current/cancel_email_change.json`,
                {
                    method: 'DELETE',
                    credentials: 'same-origin',
                    headers: {
                        Accept: 'application/json',
                        'X-CSRF-Token':
                            document.querySelector('meta[name="csrf-token"]')
                                ?.content || '',
                    },
                }
            );
            if (!response.ok)
                throw new Error('Email change cancellation failed');
            dispatch(receiveData(await response.json()));
        } catch {
            setFailed(true);
        } finally {
            setIsCancelling(false);
        }
    }

    return (
        <div className="pending-email-change">
            <InlineNotification
                variant="info"
                description={Array.isArray(notice) ? notice.join('') : notice}
                isClosable={false}
                role="status"
            />
            <Button
                buttonText={t('user.pending_email_change.cancel')}
                variant="contained"
                size="sm"
                isLoading={isCancelling}
                onClick={cancelEmailChange}
            />
            {failed && (
                <InlineNotification
                    variant="error"
                    description={t('user.pending_email_change.error')}
                    isClosable={false}
                />
            )}
        </div>
    );
}
