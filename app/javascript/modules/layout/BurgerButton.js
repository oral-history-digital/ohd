import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FaTimes, FaBars } from 'react-icons/fa';

function BurgerButton({ className, open = false, onClick }) {
    return (
        <button
            type="button"
            className={classNames(className, 'Button', 'BurgerButton', {
                'is-open': open,
                'is-closed': !open,
            })}
            onClick={onClick}
        >
            {open ? (
                <FaTimes className="BurgerButton-icon" />
            ) : (
                <FaBars className="BurgerButton-icon" />
            )}
        </button>
    );
}

BurgerButton.propTypes = {
    className: PropTypes.string,
    open: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
};

export default BurgerButton;
