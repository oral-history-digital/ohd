import { CustomCheckbox } from '@reach/checkbox';
import '@reach/checkbox/styles.css';
import classNames from 'classnames';
import PropTypes from 'prop-types';

export default function Checkbox({ className, ...props }) {
    return (
        <CustomCheckbox
            className={classNames('Checkbox', className)}
            {...props}
        />
    );
}

Checkbox.propTypes = {
    className: PropTypes.string,
};
