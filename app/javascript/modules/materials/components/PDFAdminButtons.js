import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

import { usePDFMaterialApi } from 'modules/api';
import { getArchiveId } from 'modules/archive';
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

    async function deleteMaterial(id, callback) {
        mutatePDFMaterials(async (materials) => {
            await deletePDFMaterial(archiveId, id);

            const updatedMaterials = {
                ...materials,
                data: { ...materials.data },
            };
            delete updatedMaterials.data[id];

            return updatedMaterials;
        });

        if (typeof callback === 'function') {
            callback();
        }
    }

    return (
        <div>
            <Modal
                title={t('edit.pdf.edit')}
                trigger={<FaPencilAlt className="Icon Icon--editorial" />}
                triggerClassName=""
            >
                {(closeModal) => (
                    <PDFForm
                        pdf={pdf}
                        onSubmit={closeModal}
                        onCancel={closeModal}
                    />
                )}
            </Modal>
            <Modal
                title={t('edit.pdf.delete')}
                trigger={<FaTrash className="Icon Icon--editorial" />}
            >
                {(closeModal) => (
                    <DeleteItemForm
                        onSubmit={() => deleteMaterial(pdf.id, closeModal)}
                        onCancel={closeModal}
                    />
                )}
            </Modal>
        </div>
    );
}

PDFAdminButtons.propTypes = {
    pdf: PropTypes.object.isRequired,
};
