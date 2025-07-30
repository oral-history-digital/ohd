import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';


import { getArchiveId } from 'modules/archive';
import { AuthorizedContent } from 'modules/auth';
import { deleteData } from 'modules/data';
import { DeleteItemForm } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Modal } from 'modules/ui';

import PDFForm from './PDFForm';

export default function PDFAdminButtons({ pdf }) {
    const dispatch = useDispatch();
    const archiveId = useSelector(getArchiveId);
    const { t, locale } = useI18n();
    const { projectId, project } = useProject();

    const destroy = () => dispatch(deleteData({ locale, projectId, project }, 'interviews', archiveId, 'pdfs', pdf.id));

    return (
        <AuthorizedContent object={pdf} action='update'>
            <div className="">
                <Modal
                    title={t('edit.pdf.edit')}
                    trigger={<FaPencilAlt />}
                    triggerClassName=""
                >
                    {closeModal => (
                        <PDFForm
                            pdf={pdf}
                            onSubmit={closeModal}
                            onCancel={closeModal}
                        />
                    )}
                </Modal>
                <Modal
                    title={t('edit.pdf.delete')}
                    trigger={<FaTrash />}
                >
                    {closeModal => (
                        <DeleteItemForm
                            onSubmit={() => { destroy(); closeModal(); }}
                            onCancel={closeModal}
                        />
                    )}
                </Modal>
            </div>
        </AuthorizedContent>
    );
}

PDFAdminButtons.propTypes = {
    pdf: PropTypes.object.isRequired,
};
