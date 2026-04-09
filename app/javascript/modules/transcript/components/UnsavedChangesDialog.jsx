import { useRef } from 'react';

import { useI18n } from 'modules/i18n';
import { InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';

import { useAutoScrollToRef } from '../hooks';

function UnsavedChangesDialog({ isOpen, onDismiss, onContinue }) {
    const notificationRef = useRef(null);
    const { t } = useI18n();
    const message = t('modules.transcript.unsaved_changes.warning');

    useAutoScrollToRef(notificationRef, isOpen, []);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="UnsavedChangesDialog" ref={notificationRef}>
            <InlineNotification
                variant="warning"
                title={message}
                isClosable={false}
                actions={{
                    cancel: {
                        label: t('modules.transcript.unsaved_changes.return'),
                        onClick: onDismiss,
                    },
                    submit: {
                        label: t('modules.transcript.unsaved_changes.continue'),
                        onClick: onContinue,
                    },
                }}
                className="UnsavedChangesDialog--notification"
                role="alert"
            />
        </div>
    );
}

UnsavedChangesDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onDismiss: PropTypes.func.isRequired,
    onContinue: PropTypes.func.isRequired,
};

export default UnsavedChangesDialog;
