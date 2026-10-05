import { getCurrentUser } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { Button } from 'modules/ui/Buttons';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export default function AfterUpdateEmailPopup({ onClose }) {
    const { t } = useI18n();
    const currentUser = useSelector(getCurrentUser);

    if (!currentUser?.unconfirmed_email) return null;

    return (
        <Modal
            key="after-update-email-popup"
            triggerClassName="Button Button--transparent Button--withoutPadding Button--primaryColor"
            showDialogInitially={true}
            hideButton={true}
            onClose={onClose}
            className="after-update-email-popup"
        >
            {(close) => (
                <div>
                    <p>{t('devise.registrations.update_email')}</p>
                    <div className="Form-footer u-mt">
                        <div className="Form-footer-buttons">
                            <Button
                                buttonText={t('ok')}
                                variant="contained"
                                onClick={close}
                            />
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
}

AfterUpdateEmailPopup.propTypes = {
    onClose: PropTypes.func.isRequired,
};
