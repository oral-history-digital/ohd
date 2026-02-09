import { useState } from 'react';

import { useI18n } from 'modules/i18n';
import {
    RegistryReferenceFormContainer,
    RegistryReferencesContainer,
} from 'modules/registry-references';
import { CancelButton, SubmitButton } from 'modules/ui/Buttons';
import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa';

export default function SegmentRegistryReferences({
    segment,
    interview,
    onCancel,
}) {
    const { t } = useI18n();
    const [showForm, setShowForm] = useState(false);

    const handleFormCancel = () => {
        if (showForm) {
            setShowForm(false);
        } else if (typeof onCancel === 'function') {
            onCancel();
        }
    };

    const handleFormSuccess = () => {
        setShowForm(false);
    };

    const hasReferences =
        segment.registry_references &&
        Object.keys(segment.registry_references).length > 0;

    return (
        <div className="SegmentRegistryReferences">
            {!showForm && (
                <>
                    <RegistryReferencesContainer
                        refObject={segment}
                        interview={interview}
                        inTranscript
                    />
                    {!hasReferences && (
                        <p className="SegmentRegistryReferences-empty">
                            {t('edit.segment.references.empty')}
                        </p>
                    )}
                    <button
                        type="button"
                        className="Button Button--transparent Button--add"
                        title={t('edit.segment.references.add')}
                        onClick={() => setShowForm(true)}
                    >
                        <FaPlus className="Icon Icon--editorial Icon--small" />
                        <span className="Button--label">
                            {t('edit.segment.references.add')}
                        </span>
                    </button>
                </>
            )}
            {showForm && (
                <RegistryReferenceFormContainer
                    refObject={segment}
                    interview={interview}
                    inTranscript
                    onSubmit={handleFormSuccess}
                    onCancel={handleFormCancel}
                />
            )}
            {!showForm && (
                <div className="Form-footer u-mt">
                    <div className="Form-footer-buttons">
                        <CancelButton
                            buttonText={t('cancel')}
                            handleCancel={handleFormCancel}
                        />
                        <SubmitButton
                            buttonText={t('submit')}
                            onClick={handleFormCancel}
                            isDisabled
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

SegmentRegistryReferences.propTypes = {
    segment: PropTypes.object.isRequired,
    interview: PropTypes.object.isRequired,
    onCancel: PropTypes.func,
};
