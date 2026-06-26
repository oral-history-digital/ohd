import { useI18n } from 'modules/i18n';
import { formatDate } from 'modules/utils';
import PropTypes from 'prop-types';
import { FaUserShield } from 'react-icons/fa';

export default function MfaStatusCell({ row }) {
    const { t, locale } = useI18n();
    const user = row.original;
    const otpDate = formatDate(user.changed_to_otp_at, locale);
    const passkeyDate = formatDate(user.changed_to_passkey_at, locale);
    const otpActive = Boolean(user.otp_required_for_login);
    const passkeyActive = Boolean(user.passkey_required_for_login);

    if (!otpActive && !passkeyActive) {
        return null;
    }

    const formatMfaStatus = (label, active, date) => {
        const status = t(active ? 'enabled' : 'disabled');
        const timestamp = date ? ` (${date})` : '';

        return `${label}: ${status}${timestamp}`;
    };

    const title = [
        formatMfaStatus(t('user.mfa_otp'), otpActive, otpDate),
        formatMfaStatus(t('user.mfa_passkey'), passkeyActive, passkeyDate),
    ].join('\n');

    return <FaUserShield title={title} aria-label={title} />;
}

MfaStatusCell.propTypes = {
    row: PropTypes.object.isRequired,
};
