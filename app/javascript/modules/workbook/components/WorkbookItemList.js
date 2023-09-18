import { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useProject } from 'modules/routes';
import WorkbookItemContainer from './WorkbookItemContainer';

export default function WorkbookItemList({
    contents,
    title,
}) {
    const [open, setOpen] = useState(false);
    const { project, isOhd } = useProject();

    function handleClick() {
        setOpen(prev => !prev);
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
                className={classNames('Button', 'accordion', {'active': open})}
                onClick={handleClick}
            >
                {title}
                {
                    open ?
                        <FaMinus className="Icon Icon--primary" /> :
                        <FaPlus className="Icon Icon--primary" />
                }
            </button>
            <div className={classNames('panel', {'open': open})}>
                {
                    itemsForProject()?.map((item, index, array) => (
                        <WorkbookItemContainer
                            key={item.id}
                            data={item}
                            className={index < array.length - 1 ? 'u-mb' : null}
                        />
                    ))
                }
            </div>
        </div>
    );
}

WorkbookItemList.propTypes = {
    contents: PropTypes.array,
    title: PropTypes.string,
};
