import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { openArchivePopup } from '../actions/archivePopupActionCreators';

export default function ArchivePopupButton({title, children, buttonFaKey}) {

    const dispatch = useDispatch();
    const open = useCallback(
        () => dispatch(openArchivePopup({title: title, content: children})),
        [dispatch]
    )

    return (
        <span
            className='flyout-sub-tabs-content-ico-link'
            title={title}
            onClick={open}
        >
            <i className={`fa fa-${buttonFaKey}`}></i>
            {title}
        </span>
    )
}

ArchivePopupButton.propTypes = {
    title: PropTypes.string,
    buttonFaKey: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.string,
    ]),
};
