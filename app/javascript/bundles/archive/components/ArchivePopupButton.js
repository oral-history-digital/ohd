import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { openArchivePopup } from '../actions/archivePopupActionCreators';

export default function ArchivePopupButton({title, content, buttonFaKey, authorizedObject}) {

    //
    // title, buttonFaKey, content, authorizedObject
    // e.g.:
    // title='edit contribution'
    // buttonFaKey='pencil'
    // content={<div>bla bla</div>}
    // authorizedObject={this.props.interview}
    //

    const dispatch = useDispatch();
    const open = useCallback(
        () => dispatch(openArchivePopup({title: title, content: content})),
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
    content: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.string,
    ]),
};
