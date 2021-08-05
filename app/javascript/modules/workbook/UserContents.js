import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import UserContentContainer from './UserContentContainer';

export default function UserContents({
    contents,
    type,
    locale,
    title,
}) {
    const [open, setOpen] = useState(false);

    function handleClick() {
        setOpen(prev => !prev);
    }

    const contentsForType = contents ?
        Object.values(contents).filter(content => content.type === type) :
        [];

    return (
        <div className="userContents">
            <button
                type="button"
                className={classNames('accordion', {'active': open})}
                lang={locale}
                onClick={handleClick}
            >
                {title}
            </button>
            <div className={classNames('panel', {'open': open})}>
                {
                    contentsForType.map(content => (
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
    contents: PropTypes.object,
    type: PropTypes.string,
    title: PropTypes.string,
    locale: PropTypes.string.isRequired,
};
