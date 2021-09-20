import { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import UserContentContainer from './UserContentContainer';

export default function UserContents({
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
                className={classNames('accordion', {'active': open})}
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
                    contents && contents.map(content => (
                        <UserContentContainer
                            key={content.id}
                            data={content}
                        />
                    ))
                }
            </div>
        </div>
    );
}

UserContents.propTypes = {
    contents: PropTypes.array,
    title: PropTypes.string,
};
