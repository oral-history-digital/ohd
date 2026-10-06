import { getCurrentUser } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { Button } from 'modules/ui/Buttons';
import InlineNotification from 'modules/ui/InlineNotification';
import { useSelector } from 'react-redux';

import { useCancelEmailChange } from '../hooks/useCancelEmailChange';

export default function PendingEmailChange() {
    const user = useSelector(getCurrentUser);
    const { t } = useI18n();
    const { cancelEmailChange, isCancelling, error } = useCancelEmailChange();

    if (!user?.unconfirmed_email) return null;

    const notice = t('user.pending_email_change.notice', {
        email: user.unconfirmed_email,
    });

    async function handleCancelEmailChange() {
        try {
            await cancelEmailChange();
        } catch {
            // The hook exposes the error for the notification below.
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
                onClick={handleCancelEmailChange}
            />
            {error && (
                <InlineNotification
                    variant="error"
                    description={t('user.pending_email_change.error')}
                    isClosable={false}
                />
            )}
        </div>
    );
}
