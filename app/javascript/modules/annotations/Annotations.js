import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa';

import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import AnnotationFormContainer from './AnnotationFormContainer';
import AnnotationContainer from './AnnotationContainer';

export default function Annotations({
    segment,
}) {
    const { t, locale } = useI18n();

    return (
        <div>
            {
                Object.values(segment.annotations)
                    .map(annotation => (
                        <AnnotationContainer
                            annotation={annotation}
                            segment={segment}
                            key={annotation.id}
                        />
                    ))
            }
            {
                <AuthorizedContent object={{type: 'Annotation', interview_id: segment.interview_id}} action='create'>
                    <Modal
                        title={t('edit.annotation.new')}
                        trigger={<FaPlus className="Icon Icon--editorial Icon--small"/>}
                    >
                        {closeModal => (
                            <AnnotationFormContainer
                                segment={segment}
                                locale={locale}
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
};
