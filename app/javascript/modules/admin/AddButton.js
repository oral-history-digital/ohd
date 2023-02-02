import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa';

import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { camelCase } from 'modules/strings';

export default function AddButton({
    className,
    scope,
    interview,
    task,
    onClose,
    disabled = false,
}) {
    const { t } = useI18n();

    return (
        <AuthorizedContent
            object={[{type: camelCase(scope), interview_id: interview?.id}, task]}
            action="create"
        >
            <Modal
                triggerClassName={className}
                title={t(`edit.${scope}.new`)}
                trigger={<><FaPlus className="Icon Icon--editorial" /> {t(`edit.${scope}.new`)}</>}
                disabled={disabled}
            >
                {onClose}
            </Modal>
        </AuthorizedContent>
    );
}

AddButton.propTypes = {
    className: PropTypes.string,
    scope: PropTypes.string.isRequired,
    interview: PropTypes.object,
    task: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};
