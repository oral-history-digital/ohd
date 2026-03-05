import { Dialog } from '@reach/dialog';
import '@reach/dialog/styles.css';
import { useI18n } from 'modules/i18n';
import { Button } from 'modules/ui';
import PropTypes from 'prop-types';

function UnsavedChangesDialog({ isOpen, onDismiss }) {
    const { t } = useI18n();
    const message = t('modules.transcript.unsaved_changes_warning');

    return (
        <Dialog
            className="Modal-dialog UnsavedChangesDialog"
            isOpen={isOpen}
            onDismiss={onDismiss}
            aria-label={message}
        >
            <p className="UnsavedChangesDialog-message">{message}</p>
            <div className="u-flex u-mt">
                <Button
                    buttonText={t('ok')}
                    variant="contained"
                    color="primary"
                    onClick={onDismiss}
                />
            </div>
        </Dialog>
    );
}

UnsavedChangesDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onDismiss: PropTypes.func.isRequired,
};

export default UnsavedChangesDialog;
