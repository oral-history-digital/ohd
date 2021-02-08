import React from 'react';
import PropTypes from 'prop-types';

import { AuthorizedContent } from 'modules/auth';
import { Modal } from 'modules/ui';
import { useI18n } from 'modules/i18n';
import PhotoFormContainer from './PhotoFormContainer';
import PhotoCaption from './PhotoCaption';
import styles from './Photo.module.scss';

export default function Photo({
    data,
    archiveId,
    locale,
    projectId,
    projects,
    deleteData,
}) {
    const { t } = useI18n();

    const destroy = () => deleteData({ locale, projectId, projects }, 'interviews', archiveId, 'photos', data.id);

    return (
        <div className={styles.container}>
            <AuthorizedContent object={data}>
                <div className={styles.admin}>
                    <Modal
                        title={t('edit.photo.edit')}
                        trigger={<i className="fa fa-pencil"></i>}
                        triggerClassName={styles.editButton}
                    >
                        {closeModal => (
                            <PhotoFormContainer
                                photo={data}
                                onSubmit={closeModal} />
                        )}
                    </Modal>
                    <Modal
                        title={t('edit.photo.delete')}
                        trigger={<i className="fa fa-trash-o"></i>}
                    >
                        {closeModal => (
                            <div>
                                <button className="any-button" onClick={() => { destroy(); closeModal(); }}>
                                    {t('delete')}
                                </button>
                            </div>
                        )}
                    </Modal>
                </div>
            </AuthorizedContent>

            <img
                className={styles.image}
                src={data.src}
                alt={data.captions[locale] || data.captions['de']}
            />

            <PhotoCaption
                photo={data}
                locale={locale}
            />
        </div>
    );
}

Photo.propTypes = {
    data: PropTypes.object.isRequired,
    archiveId: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    deleteData: PropTypes.func.isRequired,
};
