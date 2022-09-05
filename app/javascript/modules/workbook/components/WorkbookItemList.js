import { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import WorkbookItemContainer from './WorkbookItemContainer';

export default function WorkbookItemList({
    contents,
    title,
}) {
    const [open, setOpen] = useState(false);

    function handleClick() {
        setOpen(prev => !prev);
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
                    contents && contents.map((content, index, array) => (
                        <WorkbookItemContainer
                            key={content.id}
                            data={content}
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
