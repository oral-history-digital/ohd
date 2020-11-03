import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function BurgerButton({ open, onClick }) {
    return (
        <div className='flyout-toggle'>
            <div className={classNames({
                'icon-close': open,
                'icon-open': !open,
            })} onClick={onClick}>
                <i className={classNames('fa', {
                    'fa-close': open,
                    'fa-bars': !open,
                })}/>
            </div>
        </div>
    );
}

BurgerButton.propTypes = {
    open: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default BurgerButton;
