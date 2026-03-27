import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Button from './Button';

export function LinkButton({ to, isExternal = false, onClick, ...props }) {
    const navigate = useNavigate();

    const handleInternalClick = (event) => {
        if (onClick) {
            onClick(event);
        }

        if (event.defaultPrevented || !to) {
            return;
        }

        navigate(to);
    };

    return (
        <Button
            {...props}
            href={isExternal ? to : undefined}
            onClick={isExternal ? onClick : handleInternalClick}
        />
    );
}

LinkButton.propTypes = {
    to: PropTypes.string,
    isExternal: PropTypes.bool,
    onClick: PropTypes.func,
};

export default LinkButton;
