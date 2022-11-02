import PropTypes from 'prop-types';
import { FaEye, FaPen, FaTrash } from 'react-icons/fa';

import { Modal } from 'modules/ui';

export default function RowActions({
    row,
    displayComponent: DisplayComponent,
    formComponent: FormComponent,
    showDisplay = true,
    showEdit = true,
    showDelete = true,
}) {
    const data = row.original;

    return (
        <>
            {showDisplay && (
                <Modal
                    title="Show"
                    trigger={<FaEye className="Icon Icon--small Icon--primary" />}
                >
                    <DisplayComponent data={data} />
                </Modal>
            )}
            {showEdit && (
                <Modal
                    title="Edit"
                    trigger={<FaPen className="Icon Icon--small Icon--primary" />}
                >
                    {closeModal => (
                        <FormComponent
                            data={data}
                            onSubmit={closeModal}
                            onCancel={closeModal}
                        />
                    )}
                </Modal>
            )}
            {showDelete && (
                <button
                    type="button"
                    className="Button Button--transparent"
                >
                    <FaTrash className="Icon Icon--small Icon--primary" />
                </button>
            )}
        </>
    );
}

RowActions.propTypes = {
    row: PropTypes.object.isRequired,
    displayComponent: PropTypes.node.isRequired,
    formComponent: PropTypes.node.isRequired,
    showDisplay: PropTypes.bool,
    showEdit: PropTypes.bool,
    showDelete: PropTypes.bool,
};
