import React from 'react';
import PropTypes from 'prop-types';

import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import AnnotationFormContainer from './AnnotationFormContainer';

export default function Annotation({
    annotation,
    contentLocale,
    segment,
    locale,
    projectId,
    projects,
    deleteData,
}) {
    const { t } = useI18n();

    return (
        <div>
            <p
                className='content-trans-text-element-data'
                dangerouslySetInnerHTML={{__html: annotation.text[contentLocale]}}
            />
            <AuthorizedContent object={annotation}>
                <span className={'flyout-sub-tabs-content-ico'}>
                    <Modal
                        title={t('edit.annotation.edit')}
                        trigger={<i className="fa fa-pencil"/>}
                    >
                        {closeModal => (
                            <AnnotationFormContainer
                                annotation={annotation}
                                segment={segment}
                                contentLocale={contentLocale}
                                onSubmit={closeModal}
                            />
                        )}
                    </Modal>
                    <Modal
                        title={t('edit.annotation.delete')}
                        trigger={<i className="fa fa-trash-o"></i>}
                    >
                        {closeModal => (
                            <div>
                                <p dangerouslySetInnerHTML={{__html: annotation.text[contentLocale]}} />
                                <button
                                    type="button"
                                    className="any-button"
                                    onClick={() => {
                                        deleteData({ locale, projectId, projects }, 'annotations', annotation.id, null, null, true);
                                        closeModal();
                                    }}
                                >
                                    {t('edit.annotation.delete')}
                                </button>
                            </div>
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
    locale: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    contentLocale: PropTypes.string.isRequired,
    deleteData: PropTypes.func.isRequired,
};