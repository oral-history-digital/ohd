import { AuthorizedContent } from 'modules/auth';
import { DeleteItemForm } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { Modal } from 'modules/ui';
import { sanitizeHtml } from 'modules/utils';
import PropTypes from 'prop-types';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

import AnnotationFormContainer from './AnnotationFormContainer';

/**
 * Shows a localized annotation and authorized edit/delete controls.
 *
 * @param {Object} props - Annotation context and mutations.
 * @param {Object} props.annotation - Annotation with localized text.
 * @param {string} props.contentLocale - Content language to display.
 * @param {Object} props.segment - Segment used by the editing form.
 * @param {Function} props.deleteData - Deletes the annotation through Redux.
 * @returns {React.ReactElement} Annotation and permitted controls.
 */
export default function Annotation({
    annotation,
    contentLocale,
    segment,
    deleteData,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();

    return (
        <div className="SegmentAnnotation">
            <span
                dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(
                        annotation.text[contentLocale],
                        'BASIC'
                    ),
                }}
            />
            <AuthorizedContent object={annotation} action="update">
                <span className="flyout-sub-tabs-content-ico">
                    <Modal
                        title={t('edit.annotation.edit')}
                        trigger={
                            <FaPencilAlt className="Icon Icon--editorial Icon--small" />
                        }
                    >
                        {(closeModal) => (
                            <AnnotationFormContainer
                                annotation={annotation}
                                segment={segment}
                                contentLocale={contentLocale}
                                onSubmit={closeModal}
                                onCancel={closeModal}
                                cancelLabel={t('cancel')}
                                submitLabel={t('submit')}
                            />
                        )}
                    </Modal>
                    <Modal
                        title={t('edit.annotation.delete')}
                        trigger={
                            <FaTrash className="Icon Icon--editorial Icon--small" />
                        }
                    >
                        {(closeModal) => (
                            <DeleteItemForm
                                onSubmit={() => {
                                    deleteData(
                                        { pathBase },
                                        'annotations',
                                        annotation.id,
                                        null,
                                        null,
                                        true
                                    );
                                    closeModal();
                                }}
                                onCancel={closeModal}
                            >
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: sanitizeHtml(
                                            annotation.text[contentLocale],
                                            'BASIC'
                                        ),
                                    }}
                                />
                            </DeleteItemForm>
                        )}
                    </Modal>
                </span>
            </AuthorizedContent>
        </div>
    );
}

Annotation.propTypes = {
    annotation: PropTypes.object.isRequired,
    segment: PropTypes.object.isRequired,
    contentLocale: PropTypes.string.isRequired,
    deleteData: PropTypes.func.isRequired,
};
