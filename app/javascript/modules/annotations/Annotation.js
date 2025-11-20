import PropTypes from 'prop-types';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { DeleteItemForm } from 'modules/forms';
import { useProject } from 'modules/routes';
import AnnotationFormContainer from './AnnotationFormContainer';

export default function Annotation({
    annotation,
    contentLocale,
    segment,
    deleteData,
}) {
    const { t, locale } = useI18n();
    const { project, projectId } = useProject();

    return (
        <div>
            <p
                className=""
                dangerouslySetInnerHTML={{
                    __html: annotation.text[contentLocale],
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
                                        { locale, projectId, project },
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
                                        __html: annotation.text[contentLocale],
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
