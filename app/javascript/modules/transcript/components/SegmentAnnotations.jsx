import { useState } from 'react';

import { AnnotationFormContainer } from 'modules/annotations';
import AnnotationContainer from 'modules/annotations/AnnotationContainer';
import { useI18n } from 'modules/i18n';
import { CancelButton, SubmitButton } from 'modules/ui/Buttons';
import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa';

export default function SegmentAnnotations({
    segment,
    contentLocale,
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

    const annotations = Object.values(segment.annotations || {}).filter(
        (annotation) =>
            Object.prototype.hasOwnProperty.call(annotation.text, contentLocale)
    );

    return (
        <div className="SegmentAnnotations">
            {!showForm && (
                <>
                    {annotations.length > 0 && (
                        <ul className="SegmentAnnotations-list">
                            {annotations.map((annotation) => (
                                <AnnotationContainer
                                    annotation={annotation}
                                    segment={segment}
                                    key={annotation.id}
                                    contentLocale={contentLocale}
                                />
                            ))}
                        </ul>
                    )}
                    {annotations.length === 0 && (
                        <p className="SegmentAnnotations-empty">
                            {t('edit.segment.annotations.empty')}
                        </p>
                    )}
                    <button
                        type="button"
                        className="Button Button--transparent Button--add"
                        title={t('edit.segment.annotations.add')}
                        onClick={() => setShowForm(true)}
                    >
                        <FaPlus className="Icon Icon--editorial Icon--small" />
                        <span className="Button--label">
                            {t('edit.segment.annotations.add')}
                        </span>
                    </button>
                </>
            )}
            {showForm && (
                <AnnotationFormContainer
                    segment={segment}
                    contentLocale={contentLocale}
                    onSubmit={handleFormSuccess}
                    onCancel={handleFormCancel}
                    submitLabel={t('submit')}
                    cancelLabel={t('cancel')}
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

SegmentAnnotations.propTypes = {
    segment: PropTypes.object.isRequired,
    contentLocale: PropTypes.string.isRequired,
    onCancel: PropTypes.func,
};
