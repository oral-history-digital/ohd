import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa';

import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import AnnotationFormContainer from './AnnotationFormContainer';
import AnnotationContainer from './AnnotationContainer';

export default function Annotations({ segment, contentLocale }) {
    const { t } = useI18n();

    return (
        <div>
            {Object.values(segment.annotations)
                .filter((annotation) =>
                    annotation.text.hasOwnProperty(contentLocale)
                )
                .map((annotation) => (
                    <AnnotationContainer
                        annotation={annotation}
                        segment={segment}
                        key={annotation.id}
                        contentLocale={contentLocale}
                    />
                ))}
            {
                <AuthorizedContent
                    object={{
                        type: 'Annotation',
                        interview_id: segment.interview_id,
                    }}
                    action="create"
                >
                    <Modal
                        title={t('edit.annotation.new')}
                        trigger={
                            <FaPlus className="Icon Icon--editorial Icon--small" />
                        }
                    >
                        {(closeModal) => (
                            <AnnotationFormContainer
                                segment={segment}
                                contentLocale={contentLocale}
                                onSubmit={closeModal}
                                onCancel={closeModal}
                                cancelLabel={t('cancel')}
                                submitLabel={t('submit')}
                            />
                        )}
                    </Modal>
                </AuthorizedContent>
            }
        </div>
    );
}

Annotations.propTypes = {
    segment: PropTypes.object.isRequired,
    contentLocale: PropTypes.string.isRequired,
};
