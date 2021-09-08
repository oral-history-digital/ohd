import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { FaEye, FaPencilAlt, FaTrash } from 'react-icons/fa';

import { openArchivePopup } from '../actions';

export default function ArchivePopupButton({
    title,
    children,
    type,
}) {
    const dispatch = useDispatch();
    const open = useCallback(
        () => dispatch(openArchivePopup({title: title, content: children})),
        [dispatch]
    );

    let IconComponent;
    switch (type) {
    case 'show':
        IconComponent = FaEye;
        break;
    case 'edit':
        IconComponent = FaPencilAlt;
        break;
    case 'delete':
        IconComponent = FaTrash;
        break;
    default:
    }

    return (
        <button
            type="button"
            className="PopupMenu-trigger"
            title={title}
            onClick={open}
        >
            <IconComponent className="Icon Icon--editorial" />
            {' '}
            {title}
        </button>
    )
}

ArchivePopupButton.propTypes = {
    title: PropTypes.string,
    type: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.string,
    ]),
};
