import classNames from 'classnames';
import PropTypes from 'prop-types';
import { CustomCheckbox } from '@reach/checkbox';
import '@reach/checkbox/styles.css';

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
