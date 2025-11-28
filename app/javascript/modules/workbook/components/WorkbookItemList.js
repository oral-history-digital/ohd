import { useState } from 'react';

import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import PropTypes from 'prop-types';
import { FaMinus, FaPlus } from 'react-icons/fa';

import WorkbookItemContainer from './WorkbookItemContainer';

export default function WorkbookItemList({ type, contents }) {
    const { t } = useI18n();
    const [open, setOpen] = useState(false);
    const { project, isOhd } = useProject();

    function handleClick() {
        setOpen((prev) => !prev);
    }

    function itemsForProject() {
        if (isOhd) {
            return contents;
        } else {
            return contents?.filter((item) => item.project_id === project.id);
        }
    }

    return (
        <div className="userContents">
            <button
                type="button"
                className={classNames('Button', 'accordion', { active: open })}
                onClick={handleClick}
            >
                {t(type)}
                {open ? (
                    <FaMinus className="Icon Icon--primary" />
                ) : (
                    <FaPlus className="Icon Icon--primary" />
                )}
            </button>
            <div className={classNames('panel', { open: open })}>
                {itemsForProject()?.map((item, index, array) => (
                    <WorkbookItemContainer
                        key={item.id}
                        data={item}
                        className={index < array.length - 1 ? 'u-mb' : null}
                    />
                ))}
            </div>
        </div>
    );
}

WorkbookItemList.propTypes = {
    type: PropTypes.oneOf([
        'saved_searches',
        'saved_interviews',
        'saved_annotations',
    ]).isRequired,
    contents: PropTypes.array,
};
