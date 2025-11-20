import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FaSortUp, FaSortDown } from 'react-icons/fa';

export default function SortButton({
    direction,
    children,
    onClick,
    className,
}) {
    return (
        <button
            type="button"
            className={classNames(
                'Button',
                'Button--transparent',
                'Button--icon',
                'Button--withoutPadding',
                className
            )}
            onClick={onClick}
        >
            {children}{' '}
            {direction &&
                (direction === 'asc' ? (
                    <FaSortUp className="Icon" />
                ) : (
                    <FaSortDown className="Icon" />
                ))}
        </button>
    );
}

SortButton.propTypes = {
    direction: PropTypes.oneOf(['asc', 'desc', false]),
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
};
