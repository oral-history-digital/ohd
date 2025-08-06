import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

import { usePDFMaterialApi } from 'modules/api';
import { getArchiveId } from 'modules/archive';
import { AuthorizedContent } from 'modules/auth';
import { DeleteItemForm } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';

import useMutatePDFMaterials from '../hooks/useMutatePDFMaterials';
import PDFForm from './PDFForm';

export default function PDFAdminButtons({ pdf }) {
    const archiveId = useSelector(getArchiveId);
    const { t } = useI18n();
    const mutatePDFMaterials = useMutatePDFMaterials(archiveId);
    const { deletePDFMaterial } = usePDFMaterialApi();

    async function handleDeletePDFMaterial(id, callback) {
        mutatePDFMaterials(async pdfs => {
            await deletePDFMaterial(archiveId, id);

            const updatedPDFs = {
                ...pdfs,
                data: { ...pdfs.data }
            };
            delete updatedPDFs.data[id];

            return updatedPDFs;
        });

        if (typeof callback === 'function') {
            callback();
        }
    }

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
                            onSubmit={() => handleDeletePDFMaterial(pdf.id, closeModal)}
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
