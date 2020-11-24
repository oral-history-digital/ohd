import React from 'react';
import PropTypes from 'prop-types';
import { useAuthorization } from '../hooks/authorization';

function AuthorizedContent({
    object,
    children,
}) {
    const { isAuthorized } = useAuthorization();

    if (isAuthorized(object)) {
        return children;
    }

    return null;
}

AuthorizedContent.propTypes = {
    object: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
};

export default AuthorizedContent;
