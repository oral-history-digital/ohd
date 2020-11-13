import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function BurgerButton({ open, onClick }) {
    return (
        <button type="button"
                className={classNames('BurgerButton', {
                    'is-open': open,
                    'is-closed': !open,
                })}
                onClick={onClick}>
            <i className={classNames('BurgerButton-icon', 'fa', {
                'fa-close': open,
                'fa-bars': !open,
            })}/>
        </button>
    );
}

BurgerButton.propTypes = {
    open: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
};

BurgerButton.defaultProps = {
    open: false,
};

export default BurgerButton;
