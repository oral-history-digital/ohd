import { useMaterialApi } from 'modules/api';
import { getArchiveId } from 'modules/archive';
import { DeleteItemForm } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import PropTypes from 'prop-types';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import useMutateMaterials from '../hooks/useMutateMaterials';
import MaterialForm from './MaterialForm';

export default function MaterialAdminButtons({ material }) {
    const archiveId = useSelector(getArchiveId);
    const { t } = useI18n();
    const mutateMaterials = useMutateMaterials(archiveId);
    const { deleteMaterial } = useMaterialApi();

    async function handleDeleteClick(id, callback) {
        mutateMaterials(async (materials) => {
            await deleteMaterial(archiveId, id);

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
                title={t('edit.material.edit')}
                trigger={<FaPencilAlt className="Icon Icon--editorial" />}
                triggerClassName=""
            >
                {(closeModal) => (
                    <MaterialForm
                        material={material}
                        onSubmit={closeModal}
                        onCancel={closeModal}
                    />
                )}
            </Modal>
            <Modal
                title={t('edit.material.delete')}
                trigger={<FaTrash className="Icon Icon--editorial" />}
            >
                {(closeModal) => (
                    <DeleteItemForm
                        onSubmit={() =>
                            handleDeleteClick(material.id, closeModal)
                        }
                        onCancel={closeModal}
                    />
                )}
            </Modal>
        </div>
    );
}

MaterialAdminButtons.propTypes = {
    material: PropTypes.object.isRequired,
};
