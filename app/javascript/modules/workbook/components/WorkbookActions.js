import classNames from 'classnames';
import { getCurrentInterview } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { CopyText, Modal } from 'modules/ui';
import PropTypes from 'prop-types';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import WorkbookItemDelete from './WorkbookItemDelete';
import WorkbookItemForm from './WorkbookItemForm';

export default function WorkbookActions({ item, itemPath, className }) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const interview = useSelector(getCurrentInterview);
    const itemUrl = `${window.location.protocol}//${window.location.host}${pathBase}/${itemPath}`;

    return (
        <div className={classNames(className)}>
            <Modal
                title={t('modules.workbook.edit')}
                trigger={<FaPencilAlt className="Icon Icon--primary" />}
            >
                {(closeModal) => (
                    <WorkbookItemForm
                        interview={interview}
                        id={item.id}
                        title={item.title}
                        description={item.description}
                        properties={item.properties}
                        segmentIndex={item.properties.segmentIndex}
                        reference_id={item.reference_id}
                        reference_type={item.reference_type}
                        media_id={item.media_id}
                        type={item.type}
                        workflow_state={item.workflow_state}
                        onSubmit={closeModal}
                        onCancel={closeModal}
                    />
                )}
            </Modal>
            <Modal
                title={t('modules.workbook.delete')}
                trigger={<FaTrash className="Icon Icon--primary" />}
            >
                {(closeModal) => (
                    <WorkbookItemDelete
                        id={item.id}
                        title={item.title}
                        description={item.description}
                        onSubmit={closeModal}
                        onCancel={closeModal}
                    />
                )}
            </Modal>

            {itemUrl && (
                <CopyText iconClassName="Icon--primary" text={itemUrl} />
            )}
        </div>
    );
}

WorkbookActions.propTypes = {
    item: PropTypes.object.isRequired,
    itemPath: PropTypes.string.isRequired,
    className: PropTypes.string,
};
