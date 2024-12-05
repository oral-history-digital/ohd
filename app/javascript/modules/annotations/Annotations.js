import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa';

import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import AnnotationFormContainer from './AnnotationFormContainer';
import AnnotationContainer from './AnnotationContainer';
import { ALPHA3_TO_ALPHA2 } from 'modules/constants';

export default function Annotations({
    segment,
    contentLocale,
}) {
    const { t } = useI18n();
    const contentLocaleAlpha2 = ALPHA3_TO_ALPHA2[contentLocale];

    return (
        <div>
            {
                Object.values(segment.annotations)
                    .filter(annotation => annotation.text.hasOwnProperty(contentLocaleAlpha2))
                    .map(annotation => (
                        <AnnotationContainer
                            annotation={annotation}
                            segment={segment}
                            key={annotation.id}
                            contentLocale={contentLocaleAlpha2}
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
                                contentLocale={contentLocaleAlpha2}
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
