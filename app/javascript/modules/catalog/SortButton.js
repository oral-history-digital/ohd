import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FaSortUp, FaSortDown } from 'react-icons/fa';

export default function SortButton({ direction, children }) {
    return (
        <span
            type="button"
            className={classNames(
                'Button',
                'Button--transparent',
                'Button--icon',
                'Button--withoutPadding',
                'Button--primaryAction'
            )}
        >
            {children}{' '}
            {direction &&
                (direction === 'asc' ? (
                    <FaSortUp className="Icon" />
                ) : (
                    <FaSortDown className="Icon" />
                ))}
        </span>
    );
}

SortButton.propTypes = {
    direction: PropTypes.oneOf(['asc', 'desc', false]),
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};
