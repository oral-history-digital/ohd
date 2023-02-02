import PropTypes from 'prop-types';
import { FaEye, FaPen, FaTrash } from 'react-icons/fa';

import { Modal } from 'modules/ui';
import { useI18n } from 'modules/i18n';

export default function RowActions({
    row,
    displayComponent: DisplayComponent,
    editComponent: EditComponent,
    deleteComponent: DeleteComponent
}) {
    const { t } = useI18n();

    const data = row.original;

    return (
        <>
            {typeof DisplayComponent !== 'undefined' && (
                <Modal
                    title={t('modules.tables.show')}
                    hideHeading
                    trigger={<FaEye className="Icon Icon--small Icon--primary" />}
                >
                    <DisplayComponent data={data} />
                </Modal>
            )}
            {typeof EditComponent !== 'undefined' && (
                <Modal
                    title={t('modules.tables.edit')}
                    hideHeading
                    trigger={<FaPen className="Icon Icon--small Icon--primary" />}
                >
                    {closeModal => (
                        <EditComponent
                            data={data}
                            onSubmit={closeModal}
                            onCancel={closeModal}
                        />
                    )}
                </Modal>
            )}
            {typeof DeleteComponent !== 'undefined' && (
                <Modal
                    title={t('modules.tables.delete')}
                    hideHeading
                    trigger={<FaTrash className="Icon Icon--small Icon--primary" />}
                >
                    {closeModal => (
                        <DeleteComponent
                            data={data}
                            onSubmit={closeModal}
                            onCancel={closeModal}
                        />
                    )}
                </Modal>
            )}
        </>
    );
}

RowActions.propTypes = {
    row: PropTypes.object.isRequired,
    displayComponent: PropTypes.node,
    editComponent: PropTypes.node,
    deleteComponent: PropTypes.node
};
