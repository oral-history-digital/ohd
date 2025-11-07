import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FaTimes, FaBars } from 'react-icons/fa';

function BurgerButton({
    className,
    open,
    onClick,
}) {
    return (
        <button
            type="button"
            className={classNames(className, 'Button', 'BurgerButton', {
                'is-open': open,
                'is-closed': !open,
            })}
            onClick={() => {
                onClick;
                document.getElementsByClassName('Layout')[0].classList.toggle('sidebar-is-visible');
            }}
        >
            {
                open ?
                    <FaTimes className="BurgerButton-icon" /> :
                    <FaBars className="BurgerButton-icon" />
            }
        </button>
    );
}

BurgerButton.propTypes = {
    className: PropTypes.string,
    open: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
};

BurgerButton.defaultProps = {
    open: false,
};

export default BurgerButton;
