import React from 'react';
import PropTypes from 'prop-types';

import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import AnnotationFormContainer from './AnnotationFormContainer';
import AnnotationContainer from './AnnotationContainer';

export default function Annotations({
    segment,
    contentLocale,
}) {
    const { t } = useI18n();

    return (
        <div>
            {
                Object.values(segment.annotations)
                    .filter(annotation => annotation.text.hasOwnProperty(contentLocale))
                    .map(annotation => (
                        <AnnotationContainer
                            annotation={annotation}
                            segment={segment}
                            key={annotation.id}
                            contentLocale={contentLocale}
                        />
                    ))
            }
            {
                <AuthorizedContent object={{type: 'Annotation', action: 'create', interview_id: segment.interview_id}}>
                    <Modal
                        title={t('edit.annotation.new')}
                        trigger={<i className="fa fa-plus"/>}
                    >
                        {closeModal => (
                            <AnnotationFormContainer
                                segment={segment}
                                contentLocale={contentLocale}
                                onSubmit={closeModal}
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